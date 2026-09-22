---
title: "control-api environment"
description: "Typed environment declarations for control-api, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_BACKBONE_BROKERS

**Type:** RequiredList. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredList("SEAGULL_BACKBONE_BROKERS")
```

## SEAGULL_CONTROL_API_ADDRESS

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.String("SEAGULL_CONTROL_API_ADDRESS", "127.0.0.1:8445")
```

## SEAGULL_CONTROL_API_AGENT_AUTHORITY_CERT

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_AGENT_AUTHORITY_CERT")
```

## SEAGULL_CONTROL_API_AGENT_AUTHORITY_KEY

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_AGENT_AUTHORITY_KEY")
```

## SEAGULL_CONTROL_API_AGENT_CA

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_AGENT_CA")
```

## SEAGULL_CONTROL_API_AGENT_CERT_LIFETIME

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_AGENT_CERT_LIFETIME", 7*24*time.Hour, pki.MinValidity, pki.MaxValidity)
```

## SEAGULL_CONTROL_API_AGENT_TRUST_BUNDLE

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_AGENT_TRUST_BUNDLE")
```

## SEAGULL_CONTROL_API_ANNOUNCE_BATCH

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_ANNOUNCE_BATCH", 100, 1, 500)
```

## SEAGULL_CONTROL_API_ANNOUNCE_INTERVAL

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_ANNOUNCE_INTERVAL", 30*time.Second, time.Second, time.Hour)
```

## SEAGULL_CONTROL_API_CALLER_CA

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_CALLER_CA")
```

## SEAGULL_CONTROL_API_IDLE_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_IDLE_TIMEOUT", 60*time.Second, time.Second, 30*time.Minute)
```

## SEAGULL_CONTROL_API_LIVENESS_BACKDATING

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_LIVENESS_BACKDATING", clickhouse.DefaultLivenessBackdating, 0, 365*24*time.Hour)
```

## SEAGULL_CONTROL_API_LIVENESS_HORIZON

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_LIVENESS_HORIZON", clickhouse.DefaultLivenessHorizon, time.Hour, 365*24*time.Hour)
```

## SEAGULL_CONTROL_API_POLICY

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_POLICY")
```

## SEAGULL_CONTROL_API_RATE_BURST

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_RATE_BURST", 40, 1, 100_000)
```

## SEAGULL_CONTROL_API_RATE_PER_SECOND

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_RATE_PER_SECOND", 20, 0, 10_000)
```

## SEAGULL_CONTROL_API_READ_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_READ_TIMEOUT", 15*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_CONTROL_API_RENEWAL_ADDRESS

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.String("SEAGULL_CONTROL_API_RENEWAL_ADDRESS", "127.0.0.1:8446")
```

## SEAGULL_CONTROL_API_RENEWAL_BURST

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_RENEWAL_BURST", 4, 1, 1_000)
```

## SEAGULL_CONTROL_API_RENEWAL_INTERVAL

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_RENEWAL_INTERVAL", time.Minute, time.Second, 24*time.Hour)
```

## SEAGULL_CONTROL_API_RENEWAL_TLS_CERT

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_RENEWAL_TLS_CERT")
```

## SEAGULL_CONTROL_API_RENEWAL_TLS_KEY

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_RENEWAL_TLS_KEY")
```

## SEAGULL_CONTROL_API_RULESET_RECORDS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_RULESET_RECORDS", 256, 1, 10_000)
```

## SEAGULL_CONTROL_API_SESSIONS_MAX

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_SESSIONS_MAX", 4096, 1, 1_000_000)
```

## SEAGULL_CONTROL_API_SESSIONS_PER_CALLER

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_SESSIONS_PER_CALLER", 8, 1, 64)
```

## SEAGULL_CONTROL_API_SESSION_KEY

**Type:** Secret. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Secret("SEAGULL_CONTROL_API_SESSION_KEY")
```

## SEAGULL_CONTROL_API_SESSION_LIFETIME

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_SESSION_LIFETIME", 15*time.Minute, time.Minute, 24*time.Hour)
```

## SEAGULL_CONTROL_API_START_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_START_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_CONTROL_API_TLS_CERT

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_TLS_CERT")
```

## SEAGULL_CONTROL_API_TLS_KEY

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_CONTROL_API_TLS_KEY")
```

## SEAGULL_CONTROL_API_TRACKED_CALLERS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_TRACKED_CALLERS", 4096, 1, 1_000_000)
```

## SEAGULL_CONTROL_API_TRACKED_RENEWING_AGENTS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Int("SEAGULL_CONTROL_API_TRACKED_RENEWING_AGENTS", 8192, 1, 1_000_000)
```

## SEAGULL_CONTROL_API_WRITE_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/control-api/config.go).

```go
parser.Duration("SEAGULL_CONTROL_API_WRITE_TIMEOUT", 15*time.Second, time.Second, 5*time.Minute)
```

