---
title: "analysis-engine environment"
description: "Typed environment declarations for analysis-engine, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_ANALYSIS_BATCH_EVENTS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Int("SEAGULL_ANALYSIS_BATCH_EVENTS", 5_000, 1, 100_000)
```

## SEAGULL_ANALYSIS_CONSUMER_GROUP

**Type:** String. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.String("SEAGULL_ANALYSIS_CONSUMER_GROUP", serviceName)
```

## SEAGULL_ANALYSIS_FETCH_MAX_WAIT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Duration("SEAGULL_ANALYSIS_FETCH_MAX_WAIT", time.Second, 10*time.Millisecond, time.Minute)
```

## SEAGULL_ANALYSIS_RULESET_RECORDS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Int("SEAGULL_ANALYSIS_RULESET_RECORDS", 256, 1, 10_000)
```

## SEAGULL_ANALYSIS_START_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Duration("SEAGULL_ANALYSIS_START_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_BACKBONE_BROKERS

**Type:** RequiredList. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.RequiredList("SEAGULL_BACKBONE_BROKERS")
```

## SEAGULL_DETECTION_PUBLISH_TIMEOUT

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Duration("SEAGULL_DETECTION_PUBLISH_TIMEOUT", 30*time.Second, time.Second, 5*time.Minute)
```

## SEAGULL_DETECTION_RETRY_DELAY

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Duration("SEAGULL_DETECTION_RETRY_DELAY", time.Second, 100*time.Millisecond, time.Minute)
```

## SEAGULL_DETECTION_RETRY_DELAY_MAX

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Duration("SEAGULL_DETECTION_RETRY_DELAY_MAX", 30*time.Second, time.Second, 10*time.Minute)
```

## SEAGULL_DETECTION_RULES

**Type:** FilePath. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.FilePath("SEAGULL_DETECTION_RULES", "/etc/seagull/rules")
```

## SEAGULL_DETECTION_STATE_KEYS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Int("SEAGULL_DETECTION_STATE_KEYS", 4096, 1, detectionstate.MaxKeys)
```

## SEAGULL_DETECTION_STATE_OBSERVATIONS

**Type:** Int. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Int("SEAGULL_DETECTION_STATE_OBSERVATIONS", 128, 2, detectionstate.MaxObservationsPerKey)
```

## SEAGULL_DETECTION_STATE_SOLE_READER

**Type:** Bool. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Bool("SEAGULL_DETECTION_STATE_SOLE_READER", false)
```

## SEAGULL_DETECTION_STATE_WINDOW

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Duration("SEAGULL_DETECTION_STATE_WINDOW", time.Hour, time.Minute, detectionstate.MaxWindow)
```

## SEAGULL_EVENT_MAX_CLOCK_SKEW

**Type:** Duration. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/analysis-engine/config.go).

```go
parser.Duration("SEAGULL_EVENT_MAX_CLOCK_SKEW", 5*time.Minute, time.Second, time.Hour)
```

