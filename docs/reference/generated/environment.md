---
title: "Environment variable index"
description: "Complete source-derived environment variable declarations grouped by process."
---

The declarations below are extracted from the typed configuration calls, including shared broker, store, and process settings. Arguments preserve their Go notation so defaults and limits are not guessed. `Duration(name, default, minimum, maximum)`, `Int`, and `Bytes` carry bounds. `Required*` has no default; `Enum` lists its default first. `Secret` has no public default. A service-name constant denotes the executable name. The explanatory [configuration guide](/docs/configuration/overview) describes file-based values and deployment overrides.

- [advisory-importer](./environment/advisory-importer.md) — 15 declarations.
- [advisory-writer](./environment/advisory-writer.md) — 6 declarations.
- [alert-writer](./environment/alert-writer.md) — 8 declarations.
- [analysis-engine](./environment/analysis-engine.md) — 15 declarations.
- [backbone-migrator](./environment/backbone-migrator.md) — 3 declarations.
- [control-api](./environment/control-api.md) — 33 declarations.
- [control-migrator](./environment/control-migrator.md) — 2 declarations.
- [detection-writer](./environment/detection-writer.md) — 6 declarations.
- [event-writer](./environment/event-writer.md) — 6 declarations.
- [ingest-gateway](./environment/ingest-gateway.md) — 24 declarations.
- [inventory-projector](./environment/inventory-projector.md) — 6 declarations.
- [query-api](./environment/query-api.md) — 18 declarations.
- [shared](./environment/shared.md) — 40 declarations.
- [store-migrator](./environment/store-migrator.md) — 2 declarations.
