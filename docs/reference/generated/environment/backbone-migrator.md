---
title: "backbone-migrator environment"
description: "Typed environment declarations for backbone-migrator, including defaults and validation bounds."
---

Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.

## SEAGULL_BACKBONE_BROKERS

**Type:** RequiredList. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/backbone-migrator/config.go).

```go
parser.RequiredList("SEAGULL_BACKBONE_BROKERS")
```

## SEAGULL_LOG_FORMAT

**Type:** Enum. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/backbone-migrator/config.go).

```go
parser.Enum("SEAGULL_LOG_FORMAT", log.FormatJSON, log.FormatJSON, log.FormatText)
```

## SEAGULL_LOG_LEVEL

**Type:** Enum. [Declaration](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/cmd/backbone-migrator/config.go).

```go
parser.Enum("SEAGULL_LOG_LEVEL", "info", "debug", "info", "warn", "error")
```

