---
title: "advisory-importer environment"
description: "Typed environment declarations for advisory-importer, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_ADVISORY_FEEDS

**Type:** RequiredList. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.RequiredList("SEAGULL_ADVISORY_FEEDS")
```

## SEAGULL_ADVISORY_FETCH_ATTEMPTS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Int("SEAGULL_ADVISORY_FETCH_ATTEMPTS", 3, 1, 10)
```

## SEAGULL_ADVISORY_FETCH_BACKOFF

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Duration("SEAGULL_ADVISORY_FETCH_BACKOFF", time.Second, 10*time.Millisecond, time.Minute)
```

## SEAGULL_ADVISORY_FETCH_CONCURRENCY

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Int("SEAGULL_ADVISORY_FETCH_CONCURRENCY", 8, 1, 32)
```

## SEAGULL_ADVISORY_FETCH_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Duration("SEAGULL_ADVISORY_FETCH_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_ADVISORY_MAX_INDEX_BYTES

**Type:** Bytes. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Bytes("SEAGULL_ADVISORY_MAX_INDEX_BYTES", 64<<20, 1<<20, 1<<30)
```

## SEAGULL_ADVISORY_MAX_RECORD_BYTES

**Type:** Bytes. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Bytes("SEAGULL_ADVISORY_MAX_RECORD_BYTES", 4<<20, 64<<10, 64<<20)
```

## SEAGULL_ADVISORY_OSV_CA

**Type:** FilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.FilePath("SEAGULL_ADVISORY_OSV_CA", "")
```

## SEAGULL_ADVISORY_OSV_EXPORT

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.String("SEAGULL_ADVISORY_OSV_EXPORT", "https://osv-vulnerabilities.storage.googleapis.com")
```

## SEAGULL_ADVISORY_PUBLISH_BATCH

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Int("SEAGULL_ADVISORY_PUBLISH_BATCH", 64, 1, 1_000)
```

## SEAGULL_ADVISORY_REPLAY_RECORDS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Int("SEAGULL_ADVISORY_REPLAY_RECORDS", 1_000, 1, 100_000)
```

## SEAGULL_ADVISORY_START_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Duration("SEAGULL_ADVISORY_START_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_ADVISORY_SYNC_INTERVAL

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Duration("SEAGULL_ADVISORY_SYNC_INTERVAL", time.Hour, time.Minute, 24*time.Hour)
```

## SEAGULL_ADVISORY_SYNC_RETRY_DELAY

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.Duration("SEAGULL_ADVISORY_SYNC_RETRY_DELAY", time.Minute, time.Second, 24*time.Hour)
```

## SEAGULL_BACKBONE_BROKERS

**Type:** RequiredList. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/advisory-importer/config.go).

```go
parser.RequiredList("SEAGULL_BACKBONE_BROKERS")
```

