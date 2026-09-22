---
title: "Metric declarations"
description: "Source-derived metric names, subsystems, and help text for backend operational signals."
---

These declarations are extracted from registered metric option blocks. Full names combine the registry namespace (`seagull`), subsystem, and name; histogram exposition also includes bucket/sum/count series. Check the live `/metrics` response for the signals registered by a specific executable. See [observability](/docs/observability/health).

## internal/advisoryfeed

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/advisoryfeed/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_advisoryfeed_syncs_total` | Attempts to follow a feed, by whether they read everything it listed. |
| `seagull_advisoryfeed_advisories_total` | Records a feed listed as changed, by what the importer made of them. |
| `seagull_advisoryfeed_checked_timestamp_seconds` | When the importer last asked a feed what it lists. |
| `seagull_advisoryfeed_synced_timestamp_seconds` | When the platform last held everything a feed listed: how old its copy of the feed is. |
| `seagull_advisoryfeed_newest_listed_timestamp_seconds` | The newest change a feed itself lists: how current the feed is. |
| `seagull_advisoryfeed_held_advisories` | Advisories the platform holds from a feed. |
| `seagull_advisoryfeed_sync_duration_seconds` | Time one attempt to follow a feed took. |

## internal/advisorystore

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/advisorystore/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_advisorystore_records_total` | Advisory records by what the writer did with them. |
| `seagull_advisorystore_rows_total` | Rows written, by the table they were written to. |
| `seagull_advisorystore_batches_total` | Batches of records by whether they became durable or had to be retried. |
| `seagull_advisorystore_refusals_total` | Records that were not advisories this build could store, by why. |
| `seagull_advisorystore_batch_records` | Records carried by a batch handed to the advisory writer. |
| `seagull_advisorystore_write_duration_seconds` | Time spent making a batch of advisories durable in the store. |

## internal/alertstore

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/alertstore/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_alertstore_alerts_total` | Detections by what became of them: raised, folded, repeated or cooled down. |
| `seagull_alertstore_incidents_total` | Correlations by what became of them: opened, or recognised as one already open. |
| `seagull_alertstore_batches_total` | Batches of detections by whether they became durable or had to be retried. |
| `seagull_alertstore_skipped_total` | Records that did not become an alert, by why. |
| `seagull_alertstore_suppressed_total` | Detections the estate declared it does not want as work, by rule and by the reason written down. |
| `seagull_alertstore_batch_detections` | Records carried by a batch handed to the alert writer. |
| `seagull_alertstore_write_duration_seconds` | Time spent making a batch of alerts durable in the store. |

## internal/analysis

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/analysis/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_analysis_events_total` | Records by what the engine could do with them. |
| `seagull_analysis_refusals_total` | Records the engine could not turn into an event, by why. |
| `seagull_analysis_routed_total` | Events by the route their class sends them down. |
| `seagull_analysis_unrouted_total` | Events this build has no route for, by the class they carry. |
| `seagull_analysis_normalized_total` | Events the engine had to rewrite into canonical form, by route. |
| `seagull_analysis_batch_events` | Records carried by a batch handed to the engine. |
| `seagull_analysis_event_delay_seconds` | Distance between the platform accepting an event and the engine analysing it. |
| `seagull_detection_evaluations_total` | Rules decided against an event, by the route they are registered on. |
| `seagull_detection_matches_total` | Rules that matched an event, by route and by how much the rule says it matters. |
| `seagull_detection_seconds` | Time spent deciding one event against every rule on its route. |
| `seagull_detection_published_total` | Detections the backbone made durable. |
| `seagull_detection_batches_total` | Batches of detections by whether the backbone took them; a retry is counted apart from the batch it belongs to. |
| `seagull_detection_state_observations_total` | Events a counting rule matched, by what its window did with them. |
| `seagull_detection_state_saturated_total` | Observations folded into a key that was already full, whose count is therefore a floor. |
| `seagull_detection_sequences_unordered_total` | Sequences whose events were timed by clocks disagreeing by more than the sequence itself lasted, so the order is reported and not vouched for. |

## internal/broker

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/broker/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_backbone_records_fetched_total` | Records fetched from the backbone. |
| `seagull_backbone_fetch_errors_total` | Failed fetches, by topic and partition. |
| `seagull_backbone_commit_errors_total` | Refused attempts to advance the group position. |
| `seagull_backbone_consumer_lag_refresh_errors_total` | Failed attempts to refresh partition end offsets. |
| `seagull_backbone_consumer_lag_records` | Records between the committed processing position and the end of the partition. |
| `seagull_backbone_state_rebuild_partitions_total` | Partitions read back from an earlier position so what a rule remembers could be rebuilt. |
| `seagull_backbone_state_rebuild_records_total` | Records a rebuild put back in front of the reader. |
| `seagull_backbone_partitions_moved_total` | Partitions this reader took from its group or gave back to it. |
| `seagull_backbone_partitions_held` | Partitions of the topic this reader is currently assigned. |

## internal/control

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/control/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_control_policy_info` | Identity of the policy the process is pinned to. |
| `seagull_control_policy_roles` | Roles the current policy declares. |
| `seagull_control_policy_bindings` | Subjects the current policy binds. |
| `seagull_control_policy_pinned_timestamp_seconds` | When the process last changed the policy it is pinned to. |
| `seagull_control_policy_reloads_total` | Attempts to read the policy source again, by what came of them. |
| `seagull_control_authentications_total` | Attempts to establish who a caller is, by what came of them. |
| `seagull_control_authorizations_total` | Decisions about what a caller may do, by why they were decided that way. |
| `seagull_control_sessions_live` | Sessions this process has minted and still honours. |
| `seagull_control_sessions_opened_total` | Sessions minted. |
| `seagull_control_sessions_ended_total` | Sessions that stopped being spendable, by what ended them. |
| `seagull_control_rate_limited_total` | Requests refused for spending more than a caller's share. |
| `seagull_control_rulesets_published_total` | Attempts to publish a ruleset, by what came of them. |
| `seagull_control_rulesets_activated_total` | Attempts to activate a published ruleset, by what came of them. |
| `seagull_control_alerts_moved_total` | Attempts to move an alert, by the state it reached or by refusal. |
| `seagull_control_incidents_moved_total` | Attempts to move an incident, by the state it reached or by refusal. |
| `seagull_control_agents_moved_total` | Attempts to register or move an agent, by the state it reached or by refusal. |
| `seagull_control_agent_admissions_total` | Attempts to tell the data plane what was decided about an agent, by what came of them. |
| `seagull_control_agent_certificates_issued_total` | Certificates an operator asked the platform to sign, by the state the agent reached or by refusal. |
| `seagull_control_agent_certificates_renewed_total` | Certificates an agent asked to replace with the one it held, by what came of them. |
| `seagull_control_agent_admissions_outstanding` | Agents whose recorded state the data plane has not been told about. |

## internal/detectionstore

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/detectionstore/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_detectionstore_detections_total` | Records by what the detection writer did with them. |
| `seagull_detectionstore_batches_total` | Batches of detections by whether they became durable or had to be retried. |
| `seagull_detectionstore_refusals_total` | Records that were not detections this build could store, by why. |
| `seagull_detectionstore_batch_detections` | Records carried by a batch handed to the detection writer. |
| `seagull_detectionstore_write_duration_seconds` | Time spent making a batch of detections durable in the store. |

## internal/eventstore

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/eventstore/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_eventstore_events_total` | Records by what the writer did with them. |
| `seagull_eventstore_batches_total` | Batches by whether they became durable or had to be retried. |
| `seagull_eventstore_refusals_total` | Quarantined records by why they were refused. |
| `seagull_eventstore_batch_events` | Records carried by a batch handed to the writer. |
| `seagull_eventstore_write_duration_seconds` | Time spent making a batch durable in the store. |

## internal/hunt

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/hunt/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_hunt_queries_total` | Questions asked of the store, by dataset and how they ended. |
| `seagull_hunt_refusals_total` | Questions the query plane would not put to the store, by why. |
| `seagull_hunt_page_records` | Records carried by one page of an answer. |
| `seagull_hunt_answer_duration_seconds` | Time the store spent answering one question. |

## internal/ingest

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/ingest/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_ingest_batches_total` | Event batches by admission outcome. |
| `seagull_ingest_events_total` | Events by admission outcome. |
| `seagull_ingest_rejections_total` | Rejected batches by reason. |
| `seagull_ingest_batch_events` | Events carried by an admitted batch. |
| `seagull_ingest_publish_duration_seconds` | Time spent making a batch durable in the backbone. |
| `seagull_ingest_event_lag_seconds` | Distance between the time an event happened and the time the platform accepted it. |
| `seagull_ingest_inflight_bytes` | Request bytes the gateway has reserved and not yet released. |
| `seagull_ingest_inflight_requests` | Requests the gateway is holding at once. |
| `seagull_ingest_inflight_byte_ceiling` | Request bytes the gateway holds at once before it refuses work. |
| `seagull_ingest_inflight_request_ceiling` | Requests the gateway holds at once before it refuses work. |

## internal/inventorystore

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/inventorystore/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_inventorystore_records_total` | Records by what the inventory projector did with them. |
| `seagull_inventorystore_items_total` | Items folded into the current state of an asset, by the kind of thing they are. |
| `seagull_inventorystore_scans_total` | Full enumerations that moved the line absence is measured against. |
| `seagull_inventorystore_batches_total` | Batches of records by whether they became durable or had to be retried. |
| `seagull_inventorystore_refusals_total` | Records that were not inventory this build could store, by why. |
| `seagull_inventorystore_batch_records` | Records carried by a batch handed to the inventory projector. |
| `seagull_inventorystore_write_duration_seconds` | Time spent making a batch of inventory durable in the store. |

## internal/ruleset

[Definitions](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/ruleset/metrics.go)

| Name | Meaning |
|---|---|
| `seagull_ruleset_info` | Identity of the ruleset the process is pinned to. |
| `seagull_ruleset_rules` | Rules the current ruleset holds, by whether they are evaluated. |
| `seagull_ruleset_loaded_timestamp_seconds` | When the process last changed the ruleset it is pinned to. |
| `seagull_ruleset_reloads_total` | Attempts to read the source again, by what came of them. |
| `seagull_ruleset_activations_total` | Rulesets this process was asked to run, by whether it could. |

