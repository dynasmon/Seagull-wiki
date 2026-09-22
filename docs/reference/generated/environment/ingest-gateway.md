---
title: "ingest-gateway environment"
description: "Typed environment declarations for ingest-gateway, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_BACKBONE_BROKERS

**Type:** RequiredList. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.RequiredList("SEAGULL_BACKBONE_BROKERS")
```

## SEAGULL_EVENT_MAX_AGE

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_EVENT_MAX_AGE", 168*time.Hour, time.Minute, 8760*time.Hour)
```

## SEAGULL_EVENT_MAX_CLOCK_SKEW

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_EVENT_MAX_CLOCK_SKEW", 5*time.Minute, time.Second, time.Hour)
```

## SEAGULL_GATEWAY_ADDRESS

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.String("SEAGULL_GATEWAY_ADDRESS", "0.0.0.0:8443")
```

## SEAGULL_GATEWAY_AGENT_CA

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.RequiredFilePath("SEAGULL_GATEWAY_AGENT_CA")
```

## SEAGULL_GATEWAY_ID

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.String("SEAGULL_GATEWAY_ID", serviceName)
```

## SEAGULL_GATEWAY_IDLE_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_GATEWAY_IDLE_TIMEOUT", 90*time.Second, time.Second, 30*time.Minute)
```

## SEAGULL_GATEWAY_MAX_BODY

**Type:** Bytes. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Bytes("SEAGULL_GATEWAY_MAX_BODY", 8<<20, 64<<10, 64<<20)
```

## SEAGULL_GATEWAY_MAX_EVENTS_PER_BATCH

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Int("SEAGULL_GATEWAY_MAX_EVENTS_PER_BATCH", 1_000, 1, 100_000)
```

## SEAGULL_GATEWAY_MAX_INFLIGHT_BYTES

**Type:** Bytes. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Bytes("SEAGULL_GATEWAY_MAX_INFLIGHT_BYTES", 128<<20, 1<<20, 8<<30)
```

## SEAGULL_GATEWAY_MAX_INFLIGHT_REQUESTS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Int("SEAGULL_GATEWAY_MAX_INFLIGHT_REQUESTS", 512, 1, 100_000)
```

## SEAGULL_GATEWAY_MAX_RECORDS_PER_BATCH

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Int("SEAGULL_GATEWAY_MAX_RECORDS_PER_BATCH", 64, 1, 10_000)
```

## SEAGULL_GATEWAY_PUBLISH_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_GATEWAY_PUBLISH_TIMEOUT", 10*time.Second, time.Second, time.Minute)
```

## SEAGULL_GATEWAY_RATE_BURST

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Int("SEAGULL_GATEWAY_RATE_BURST", 400, 1, 1_000_000)
```

## SEAGULL_GATEWAY_RATE_PER_SECOND

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Int("SEAGULL_GATEWAY_RATE_PER_SECOND", 200, 0, 1_000_000)
```

## SEAGULL_GATEWAY_RATE_TRACKED_AGENTS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Int("SEAGULL_GATEWAY_RATE_TRACKED_AGENTS", 10_000, 1, 1_000_000)
```

## SEAGULL_GATEWAY_READ_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_GATEWAY_READ_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_GATEWAY_ROSTER_RECORDS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Int("SEAGULL_GATEWAY_ROSTER_RECORDS", 500, 1, 100_000)
```

## SEAGULL_GATEWAY_START_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_GATEWAY_START_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_GATEWAY_TLS_CERT

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.RequiredFilePath("SEAGULL_GATEWAY_TLS_CERT")
```

## SEAGULL_GATEWAY_TLS_KEY

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.RequiredFilePath("SEAGULL_GATEWAY_TLS_KEY")
```

## SEAGULL_GATEWAY_WRITE_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_GATEWAY_WRITE_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_INVENTORY_MAX_AGE

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_INVENTORY_MAX_AGE", 720*time.Hour, time.Minute, 8760*time.Hour)
```

## SEAGULL_INVENTORY_MAX_CLOCK_SKEW

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/ingest-gateway/config.go).

```go
parser.Duration("SEAGULL_INVENTORY_MAX_CLOCK_SKEW", 5*time.Minute, time.Second, time.Hour)
```

