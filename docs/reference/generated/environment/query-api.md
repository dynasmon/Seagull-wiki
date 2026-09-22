---
title: "query-api environment"
description: "Typed environment declarations for query-api, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_QUERY_API_ADDRESS

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.String("SEAGULL_QUERY_API_ADDRESS", "127.0.0.1:8444")
```

## SEAGULL_QUERY_API_CALLER_CA

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_QUERY_API_CALLER_CA")
```

## SEAGULL_QUERY_API_CURSOR_KEY

**Type:** Secret. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Secret("SEAGULL_QUERY_API_CURSOR_KEY")
```

## SEAGULL_QUERY_API_IDLE_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Duration("SEAGULL_QUERY_API_IDLE_TIMEOUT", 60*time.Second, time.Second, 30*time.Minute)
```

## SEAGULL_QUERY_API_MAX_BODY

**Type:** Bytes. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Bytes("SEAGULL_QUERY_API_MAX_BODY", 256<<10, 4<<10, 1<<20)
```

## SEAGULL_QUERY_API_MAX_INFLIGHT

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Int("SEAGULL_QUERY_API_MAX_INFLIGHT", 32, 1, 10_000)
```

## SEAGULL_QUERY_API_MAX_ROWS_READ

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Int("SEAGULL_QUERY_API_MAX_ROWS_READ", 50_000_000, 1_000, 10_000_000_000)
```

## SEAGULL_QUERY_API_PAGE

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Int("SEAGULL_QUERY_API_PAGE", 50, 1, 500)
```

## SEAGULL_QUERY_API_PAGE_MAX

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Int("SEAGULL_QUERY_API_PAGE_MAX", 500, 1, 5000)
```

## SEAGULL_QUERY_API_RATE_BURST

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Int("SEAGULL_QUERY_API_RATE_BURST", 20, 1, 100_000)
```

## SEAGULL_QUERY_API_RATE_PER_SECOND

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Int("SEAGULL_QUERY_API_RATE_PER_SECOND", 10, 0, 10_000)
```

## SEAGULL_QUERY_API_READ_BUDGET

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Duration("SEAGULL_QUERY_API_READ_BUDGET", 15*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_QUERY_API_READ_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Duration("SEAGULL_QUERY_API_READ_TIMEOUT", 15*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_QUERY_API_TLS_CERT

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_QUERY_API_TLS_CERT")
```

## SEAGULL_QUERY_API_TLS_KEY

**Type:** RequiredFilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.RequiredFilePath("SEAGULL_QUERY_API_TLS_KEY")
```

## SEAGULL_QUERY_API_TRACKED_CALLERS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Int("SEAGULL_QUERY_API_TRACKED_CALLERS", 4096, 1, 1_000_000)
```

## SEAGULL_QUERY_API_WINDOW

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Duration("SEAGULL_QUERY_API_WINDOW", 720*time.Hour, time.Minute, 8760*time.Hour)
```

## SEAGULL_QUERY_API_WRITE_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/query-api/config.go).

```go
parser.Duration("SEAGULL_QUERY_API_WRITE_TIMEOUT", 60*time.Second, time.Second, 10*time.Minute)
```

