# Ingest performance baseline

What the gateway and the writer actually cost, measured rather than assumed, so
that the analysis engine is built on numbers instead of on the defaults someone
picked first.

## Reproducing it

```bash
make bench                                  # the hot path, one core, no broker
make test-load                              # the scenarios, against a live Redpanda
```

`make bench` needs nothing. `make test-load` starts Redpanda through
`deploy/compose.test.yaml` and drives the real gateway over real mutual TLS.

Everything below was measured on an AMD Ryzen 7 5700X, 8 cores, Linux, Go
1.25.13, with Redpanda in Docker on the same machine. The end-to-end numbers are
therefore a floor for the gateway and say nothing about a real broker cluster.

## The gateway hot path, per event

One core, no network, no broker. A batch of 10000 divided by its events:

| Stage | Where | ns/event | B/event | allocs/event | events/s |
|---|---|---|---|---|---|
| decode | `proto.Unmarshal` of the batch | 1589 | 1327 | 29 | 629379 |
| admit | stamp, validate, observe lag | 752 | 80 | 2 | 1330608 |
| encode | `proto.Marshal` per record | 1150 | 656 | 7 | 869234 |
| **total** | | **3491** | **2063** | **38** | **286451** |

**Decode is the gateway.** It is 45% of the CPU and 76% of the allocations, and
it is unavoidable in the current design: the gateway has to see inside every
event to overwrite `origin` and `reception`, so it decodes each one and then
encodes it again a few microseconds later. Nothing else on the path comes close.

Validation is 86% of the admission cost, and most of that is one regular
expression:

| `event_id` | ns/event |
|---|---|
| `bench-000000001`, 15 characters | 649 |
| a 36-character UUID | 906 |

Same allocations either way, so the difference is `identifierPattern` walking the
string. An agent that uses UUIDs pays 40% more to be validated than one that
does not, and a hand-written byte loop over `^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$`
would remove most of it. That is a change with evidence behind it now; it was
not made here, because this card is the measurement.

The writer's half, for comparison: decode plus projection is 2231 ns/event, 1552
B, 37 allocs — **448229 events/s per core**. The writer is cheaper than the
gateway because it decodes once and never re-encodes.

## Batch size: 1000, not 10000

32 concurrent agents against a gateway whose backbone discards, so this is the
gateway's own ceiling with the broker taken out of the picture:

| events/batch | events/s | p50 | p95 | p99 | B/event |
|---|---|---|---|---|---|
| 100 | 395099 | 2.6 ms | 18.8 ms | 27.2 ms | 4910 |
| 1000 | **726908** | 22.6 ms | 95.2 ms | 139.1 ms | 4377 |
| 10000 | 299928 | 389.3 ms | 2.569 s | **3.021 s** | 4473 |

**The shipped default of 10000 is the worst of the three.** It is 2.4x slower
than 1000 and its p99 is 22x worse — 3 seconds to answer one batch. It is even
slower than 100.

The reason is head-of-line: no event in a batch is published until every event in
it has been decoded and validated, so a 10000-event batch is a 2.9 MB body that
must be fully materialised — about 13 MB of transient allocation per batch at
decode — before one byte reaches the broker. Thirty-two of those at once is more
than a gigabyte in flight, and the collector spends the difference.

`SEAGULL_GATEWAY_PUBLISH_TIMEOUT` is 10s. A p99 of 3.0s at the maximum allowed
batch leaves roughly 3x headroom, so a broker having a bad minute turns into
`503` for agents that are behaving correctly.

**The recommendation is `SEAGULL_GATEWAY_MAX_EVENTS_PER_BATCH=1000`.** It is not
applied here: the ceiling is the largest batch an agent may send, so it is part
of the agent-facing contract, and `Seagull-agent-v2` has not been written yet —
which is exactly why changing it costs nothing today and will cost a rollout
later.

`SEAGULL_WRITER_BATCH_EVENTS=5000` is **not** covered by any of this. Only the
writer's CPU cost per event is known; its batch default has never been measured
against a live ClickHouse, and doing so belongs with BE-025's own load scenario.

## End to end, against a live backbone

16 agents, 500-event batches, real mutual TLS, real Redpanda, idempotent producer
waiting for every in-sync replica, zstd:

```text
4968 batches, 2484000 events in 15.01s — 165495 events/s, 4968 accepted
p50 14.1 ms   p95 138.1 ms   p99 176.4 ms   max 243.0 ms
5242 bytes allocated per event
```

Every event the gateway acknowledged was on the topic when the run finished; the
scenario compares the acknowledged count against the broker's end offsets and
fails if they differ.

Two things to read from it. The gateway sustains 165k events/s against one
Redpanda node while its own CPU ceiling is 727k, so **the broker is the
bottleneck, not the gateway** — there is roughly 4x headroom before the gateway
itself is the thing to fix. And the tail is 10x the median, which is the
producer's 5 ms linger plus all-ISR acknowledgement, not the admission path.

5242 bytes allocated per event end to end, against 2063 measured in isolation:
mutual TLS, the HTTP layer and the response account for the rest.

## What backpressure bounds, and what it does not

Bounded today:

- the body of one batch, counted as it is read (`SEAGULL_GATEWAY_MAX_BODY`, 8 MiB);
- the events in one batch (`SEAGULL_GATEWAY_MAX_EVENTS_PER_BATCH`);
- batches per second per agent, with a bounded tracked set;
- records buffered in the producer (`MaxBufferedRecords`, 200000);
- the time one publish may take.

**Not bounded: how many batches are being decoded at once.** The slow-backbone
scenario makes this concrete — 64 agents against a backbone that takes 50 ms
produced 64 simultaneous publishes, and nothing in the gateway would have stopped
6400. Peak memory is therefore `concurrent requests x batch size x ~5 KB`, and
the first factor has no ceiling: 10000 tracked agents at a burst of 400 is not a
limit on concurrency, it is a limit on rate.

At the current defaults that is 32 concurrent 10000-event batches ≈ 1.4 GB. At
the recommended 1000 it is 140 MB. **This is the strongest argument for the
batch-ceiling change, and the second-strongest for adding an in-flight limit to
the gateway** — the ingest process has no memory ceiling that an operator can
set, and the analysis engine is about to become a second consumer competing for
the same machine.

The measurement that guards it is allocation per event, not heap size: it is the
same number on any machine, and `tests/load` fails when it goes above 8 KB.

## What the scenarios prove

| Scenario | Result |
|---|---|
| sustained ingest against a real broker | 165495 events/s, nothing acknowledged that the broker did not hold |
| concurrent batches at 100, 1000 and 10000 | allocation per event stays flat; throughput does not |
| a backbone that answers in 50 ms | becomes p50 51.9 ms at the agent, not a single false acknowledgement |
| one abusive agent beside four quiet ones | 334 of 400 batches refused; the quiet agents saw no rejection at all |
| the gateway stopped mid-load | 3129 batches already acknowledged, every one of them present afterwards |

The last two are the acceptance criteria that were not provable before: the
per-agent budget contains a captured agent without spending the gateway, and a
shutdown under load loses nothing it has already answered for.

## Known bottlenecks, in order

1. **The 10000-event batch ceiling.** 2.4x throughput and 22x p99, for nothing.
2. **Unbounded decode concurrency.** No operator-settable memory ceiling on the
   ingest process.
3. **Decode-then-encode.** 2.7 µs and 36 of the 38 allocations per event go into
   turning bytes into structs and back. Removing it means stamping identity
   without fully materialising the event, which is a contract-level change and
   not worth doing before the pipeline needs the headroom.
4. **The identifier regular expression.** 649 ns of the 752 ns admission cost is
   validation, and the regexp scales with `event_id` length.

Nothing here justifies changing the code yet except (1), and that one is a
decision about the agent contract rather than about the gateway.
