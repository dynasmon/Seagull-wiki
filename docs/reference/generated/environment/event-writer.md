---
title: "event-writer environment"
description: "Typed environment declarations for event-writer, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_BACKBONE_BROKERS

**Type:** RequiredList. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/event-writer/config.go).

```go
parser.RequiredList("SEAGULL_BACKBONE_BROKERS")
```

## SEAGULL_WRITER_BATCH_EVENTS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/event-writer/config.go).

```go
parser.Int("SEAGULL_WRITER_BATCH_EVENTS", 5_000, 1, 100_000)
```

## SEAGULL_WRITER_CONSUMER_GROUP

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/event-writer/config.go).

```go
parser.String("SEAGULL_WRITER_CONSUMER_GROUP", serviceName)
```

## SEAGULL_WRITER_FETCH_MAX_WAIT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/event-writer/config.go).

```go
parser.Duration("SEAGULL_WRITER_FETCH_MAX_WAIT", time.Second, 10*time.Millisecond, time.Minute)
```

## SEAGULL_WRITER_RETRY_DELAY

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/event-writer/config.go).

```go
parser.Duration("SEAGULL_WRITER_RETRY_DELAY", time.Second, 100*time.Millisecond, time.Minute)
```

## SEAGULL_WRITER_RETRY_DELAY_MAX

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/event-writer/config.go).

```go
parser.Duration("SEAGULL_WRITER_RETRY_DELAY_MAX", 30*time.Second, time.Second, 10*time.Minute)
```

