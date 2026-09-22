---
title: "3. The protobuf contract is the event model"
description: "Architecture decision record 0003 from the Seagull backend."
---

:::info Historical decision record
This decision is reproduced from the pinned backend revision. Read amendment notices and the [current architecture](/docs/architecture/overview) before treating historical statements as current behavior.
:::


## Context

v1's event is a small struct with six typed fields and an `extra` map holding
everything that matters: the SSH action, the username, the process name, the
file path, the TLS fingerprint. The analytical schema then flattens that map
into forty-odd nullable columns, and the boundary that decides what is valid was
derived from those column widths.

v2 needs a canonical event. The question is whether the domain should own a
hand-written model with adapters mapping to and from the wire format.

## Decision

The generated protobuf types are the in-process representation. There is no
parallel hand-written model and no mapping layer.

`internal/event` owns the rules about events — identity, timestamps, bounds, the
match between a class and its body — not a second copy of their shape.

Bounds are declared in `internal/event/limits.go` as part of the contract.
Storage schemas will be derived from those numbers; the numbers will not be
derived from a storage schema.

## Consequences

- One source of truth for what an event is. A field is added in one place.
- The domain imports `google.golang.org/protobuf`. That is the data contract,
  not infrastructure, and the architecture test bans the actual infrastructure —
  HTTP, brokers, databases, metrics — from domain packages.
- No `extra` map exists. Modelling a new event class means writing a message,
  which is the friction we want: a bag of untyped keys is how v1 ended up with a
  validation boundary nobody could state.
- The contracts live in their own repository and are consumed here as a module
  dependency, so an agent can speak them without depending on the platform.
- `buf breaking` guards them there, and a change that would strand deployed
  agents fails that build rather than a review.

## Source evidence

Generated from [`docs/decisions/0003-the-contract-is-the-event-model.md`](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/docs/decisions/0003-the-contract-is-the-event-model.md) at `fa3bf69`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
