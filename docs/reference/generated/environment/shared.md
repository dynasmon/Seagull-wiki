---
title: "shared environment"
description: "Typed environment declarations for shared, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_BACKBONE_ADVISORIES_QUARANTINE_PARTITIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_ADVISORIES_QUARANTINE_PARTITIONS", 1, 1, 1_000)
```

## SEAGULL_BACKBONE_ADVISORIES_QUARANTINE_RETENTION

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Duration("SEAGULL_BACKBONE_ADVISORIES_QUARANTINE_RETENTION", 30*24*time.Hour, time.Hour, 10*365*24*time.Hour)
```

## SEAGULL_BACKBONE_ADVISORIES_QUARANTINE_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_ADVISORIES_QUARANTINE_TOPIC", "security.advisories.quarantine")
```

## SEAGULL_BACKBONE_ADVISORIES_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_ADVISORIES_TOPIC", "security.advisories")
```

## SEAGULL_BACKBONE_AGENTS_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_AGENTS_TOPIC", "security.agents")
```

## SEAGULL_BACKBONE_DETECTIONS_PARTITIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_DETECTIONS_PARTITIONS", 6, 1, 1_000)
```

## SEAGULL_BACKBONE_DETECTIONS_QUARANTINE_PARTITIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_DETECTIONS_QUARANTINE_PARTITIONS", 3, 1, 1_000)
```

## SEAGULL_BACKBONE_DETECTIONS_QUARANTINE_RETENTION

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Duration("SEAGULL_BACKBONE_DETECTIONS_QUARANTINE_RETENTION", 30*24*time.Hour, time.Hour, 10*365*24*time.Hour)
```

## SEAGULL_BACKBONE_DETECTIONS_QUARANTINE_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_DETECTIONS_QUARANTINE_TOPIC", "security.detections.quarantine")
```

## SEAGULL_BACKBONE_DETECTIONS_RETENTION

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Duration("SEAGULL_BACKBONE_DETECTIONS_RETENTION", 30*24*time.Hour, time.Hour, 10*365*24*time.Hour)
```

## SEAGULL_BACKBONE_DETECTIONS_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_DETECTIONS_TOPIC", "security.detections")
```

## SEAGULL_BACKBONE_EVENTS_PARTITIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_EVENTS_PARTITIONS", 12, 1, 1_000)
```

## SEAGULL_BACKBONE_EVENTS_RETENTION

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Duration("SEAGULL_BACKBONE_EVENTS_RETENTION", 7*24*time.Hour, time.Hour, 10*365*24*time.Hour)
```

## SEAGULL_BACKBONE_EVENTS_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_EVENTS_TOPIC", "security.events.raw")
```

## SEAGULL_BACKBONE_INVENTORY_PARTITIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_INVENTORY_PARTITIONS", 6, 1, 1_000)
```

## SEAGULL_BACKBONE_INVENTORY_QUARANTINE_PARTITIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_INVENTORY_QUARANTINE_PARTITIONS", 3, 1, 1_000)
```

## SEAGULL_BACKBONE_INVENTORY_QUARANTINE_RETENTION

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Duration("SEAGULL_BACKBONE_INVENTORY_QUARANTINE_RETENTION", 30*24*time.Hour, time.Hour, 10*365*24*time.Hour)
```

## SEAGULL_BACKBONE_INVENTORY_QUARANTINE_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_INVENTORY_QUARANTINE_TOPIC", "security.inventory.quarantine")
```

## SEAGULL_BACKBONE_INVENTORY_RETENTION

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Duration("SEAGULL_BACKBONE_INVENTORY_RETENTION", 30*24*time.Hour, time.Hour, 10*365*24*time.Hour)
```

## SEAGULL_BACKBONE_INVENTORY_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_INVENTORY_TOPIC", "security.inventory.raw")
```

## SEAGULL_BACKBONE_MIN_INSYNC_REPLICAS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_MIN_INSYNC_REPLICAS", int(replicas)/2+1, 1, 15)
```

## SEAGULL_BACKBONE_QUARANTINE_PARTITIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_QUARANTINE_PARTITIONS", 3, 1, 1_000)
```

## SEAGULL_BACKBONE_QUARANTINE_RETENTION

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Duration("SEAGULL_BACKBONE_QUARANTINE_RETENTION", 30*24*time.Hour, time.Hour, 10*365*24*time.Hour)
```

## SEAGULL_BACKBONE_QUARANTINE_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_QUARANTINE_TOPIC", "security.events.quarantine")
```

## SEAGULL_BACKBONE_REPLICAS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.Int("SEAGULL_BACKBONE_REPLICAS", 1, 1, 15)
```

## SEAGULL_BACKBONE_RULESETS_TOPIC

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/topics.go).

```go
parser.String("SEAGULL_BACKBONE_RULESETS_TOPIC", "security.rulesets")
```

## SEAGULL_BACKBONE_SASL_MECHANISM

**Type:** Enum. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.Enum("SEAGULL_BACKBONE_SASL_MECHANISM", MechanismNone, MechanismNone, MechanismScramSHA256, MechanismScramSHA512)
```

## SEAGULL_BACKBONE_SASL_PASSWORD

**Type:** Secret. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.Secret("SEAGULL_BACKBONE_SASL_PASSWORD")
```

## SEAGULL_BACKBONE_SASL_USER

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.String("SEAGULL_BACKBONE_SASL_USER", "")
```

## SEAGULL_BACKBONE_TLS

**Type:** Bool. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.Bool("SEAGULL_BACKBONE_TLS", false)
```

## SEAGULL_BACKBONE_TLS_CA

**Type:** FilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.FilePath("SEAGULL_BACKBONE_TLS_CA", "")
```

## SEAGULL_BACKBONE_TLS_CERT

**Type:** FilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.FilePath("SEAGULL_BACKBONE_TLS_CERT", "")
```

## SEAGULL_BACKBONE_TLS_KEY

**Type:** FilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.FilePath("SEAGULL_BACKBONE_TLS_KEY", "")
```

## SEAGULL_BACKBONE_TLS_SERVER_NAME

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/security.go).

```go
parser.String("SEAGULL_BACKBONE_TLS_SERVER_NAME", "")
```

## SEAGULL_LOG_FORMAT

**Type:** Enum. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/platform/service/service.go).

```go
parser.Enum("SEAGULL_LOG_FORMAT", log.FormatJSON, log.FormatJSON, log.FormatText)
```

## SEAGULL_LOG_LEVEL

**Type:** Enum. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/platform/service/service.go).

```go
parser.Enum("SEAGULL_LOG_LEVEL", "info", "debug", "info", "warn", "error")
```

## SEAGULL_OPS_ADDRESS

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/platform/service/service.go).

```go
parser.String("SEAGULL_OPS_ADDRESS", "127.0.0.1:9100")
```

## SEAGULL_READINESS_CACHE

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/platform/service/service.go).

```go
parser.Duration("SEAGULL_READINESS_CACHE", 5*time.Second, 0, time.Minute)
```

## SEAGULL_READINESS_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/platform/service/service.go).

```go
parser.Duration("SEAGULL_READINESS_TIMEOUT", 2*time.Second, 100*time.Millisecond, 30*time.Second)
```

## SEAGULL_SHUTDOWN_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/platform/service/service.go).

```go
parser.Duration("SEAGULL_SHUTDOWN_TIMEOUT", 20*time.Second, time.Second, 5*time.Minute)
```

