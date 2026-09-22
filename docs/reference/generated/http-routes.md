---
title: "HTTP route reference"
description: "HTTP methods, paths, and declared permissions extracted from backend route registration."
---

The current APIs carry binary Protocol Buffers over HTTPS. This is generated from route registrations, not an OpenAPI document: none is present in the inspected repository. See [API conventions](/docs/api/overview) for authentication, payload types, errors, and pagination.

## Control API

| Method | Path | Route | Requirement |
|---|---|---|---|
| POST | `/v1/agents` | `agent_register` | `Permits(authz.Agents, authz.Write)` |
| POST | `/v1/agents/search` | `agent_search` | `Permits(authz.Agents, authz.Read)` |
| GET | `/v1/agents/{id}` | `agent_describe` | `Permits(authz.Agents, authz.Read)` |
| GET | `/v1/agents/{id}/history` | `agent_history` | `Permits(authz.Agents, authz.Read)` |
| POST | `/v1/agents/{id}/transition` | `agent_transition` | `Permits(authz.Agents, authz.Write)` |
| POST | `/v1/agents/{id}/identity` | `agent_bind_identity` | `Permits(authz.Agents, authz.Write)` |
| POST | `/v1/alerts/search` | `alert_search` | `Permits(authz.Alerts, authz.Read)` |
| GET | `/v1/alerts/{id}` | `alert_describe` | `Permits(authz.Alerts, authz.Read)` |
| GET | `/v1/alerts/{id}/history` | `alert_history` | `Permits(authz.Alerts, authz.Read)` |
| GET | `/v1/alerts/{id}/occurrences` | `alert_occurrences` | `Permits(authz.Alerts, authz.Read)` |
| POST | `/v1/alerts/{id}/transition` | `alert_transition` | `Permits(authz.Alerts, authz.Write)` |
| POST | `/v1/alerts/{id}/assignment` | `alert_assign` | `Permits(authz.Alerts, authz.Write)` |
| POST | `/v1/agents/{id}/certificate` | `agent_certificate_issue` | `Permits(authz.Agents, authz.Write)` |
| GET | `/v1/agents/{id}/certificates` | `agent_certificate_history` | `Permits(authz.Agents, authz.Read)` |
| POST | `/v1/incidents/search` | `incident_search` | `Permits(authz.Incidents, authz.Read)` |
| GET | `/v1/incidents/{id}` | `incident_describe` | `Permits(authz.Incidents, authz.Read)` |
| GET | `/v1/incidents/{id}/history` | `incident_history` | `Permits(authz.Incidents, authz.Read)` |
| POST | `/v1/incidents/{id}/transition` | `incident_transition` | `Permits(authz.Incidents, authz.Write)` |
| POST | `/v1/incidents/{id}/assignment` | `incident_assign` | `Permits(authz.Incidents, authz.Write)` |
| GET | `/v1/rulesets` | `ruleset_list` | `Permits(authz.Rulesets, authz.Read)` |
| POST | `/v1/rulesets/validate` | `ruleset_validate` | `Permits(authz.Rulesets, authz.Read)` |
| POST | `/v1/rulesets/check` | `ruleset_check` | `Permits(authz.Rulesets, authz.Read)` |
| GET | `/v1/rulesets/{id}` | `ruleset_describe` | `Permits(authz.Rulesets, authz.Read)` |
| POST | `/v1/rulesets` | `ruleset_publish` | `Permits(authz.Rulesets, authz.Write)` |
| POST | `/v1/rulesets/{id}/activate` | `ruleset_activate` | `Permits(authz.Rulesets, authz.Write)` |
| GET | `/v1/descriptor` | `descriptor` | `Certificate()` |
| POST | `/v1/auth/session` | `session_open` | `Certificate()` |
| GET | `/v1/auth/session` | `session_describe` | `Session()` |
| DELETE | `/v1/auth/session` | `session_revoke` | `Session()` |
| GET | `/v1/auth/sessions` | `session_list` | `Session()` |

`Permits` requires a certificate-bound session and the named policy permission. `Certificate()` permits the authenticated bootstrap surfaces; `Session()` requires a live session. Tenant checks are also enforced in handlers.

## Agent and query surfaces

| Listener | Method | Path | Payload |
|---|---|---|---|
| Ingest | POST | `/v1/events` | `ingest.v1.EventBatch` → `BatchAck` |
| Ingest | POST | `/v1/inventory` | `inventory.v1.RecordBatch` → `ingest.v1.BatchAck` |
| Query | POST | `/v1/hunt/events` | `hunt.v1.Query` → `EventPage` |
| Query | POST | `/v1/hunt/detections` | `hunt.v1.Query` → `DetectionPage` |
| Agent renewal | POST | `/v1/agents/certificate` | Agent-authenticated certificate renewal |

Query scope is derived from certificate organizations, not the control session policy. The renewal listener accepts agent certificates; operator routes accept caller certificates. These trust domains are not interchangeable.

## Source evidence

Generated from [`internal/control/server.go`](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/control/server.go) at `fa3bf69`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.
