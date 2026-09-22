---
title: "Storage migration reference"
description: "Canonical SQL migrations for analytical and transactional persistence."
---

Migrations are shown in order within their owning store. Later alterations amend earlier table definitions. See [migration ownership](/docs/storage/migrations) before applying changes. This reference is not a manual execution script.

## clickhouse: 0001_security_events.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/clickhouse/schema/0001_security_events.sql)

```sql
-- One row per admitted event, projected from the contract by internal/eventstore.
-- Nothing is Nullable: absence is the zero value, as in proto3.
-- One column per line, name first: internal/clickhouse reads this file to check
-- the adapter inserts into exactly these columns, in this order.

CREATE TABLE IF NOT EXISTS security_events
(
    event_id              String,
    schema_version        UInt32,
    event_class           LowCardinality(String),
    event_time            DateTime64(3, 'UTC'),
    observed_time         DateTime64(3, 'UTC'),
    ingest_time           DateTime64(3, 'UTC'),

    tenant_id             LowCardinality(String),
    agent_id              LowCardinality(String),
    host_hostname         String,
    host_ip               String,
    host_os               LowCardinality(String),
    host_architecture     LowCardinality(String),

    collector             LowCardinality(String),
    source                String,
    sequence              UInt64,

    gateway               LowCardinality(String),
    batch_id              String,

    auth_activity         LowCardinality(String),
    auth_outcome          LowCardinality(String),
    auth_outcome_reason   LowCardinality(String),
    auth_method           LowCardinality(String),
    auth_user_name        String,
    auth_user_domain      String,
    auth_user_uid         String,
    auth_service_name     LowCardinality(String),
    auth_service_protocol LowCardinality(String),
    auth_source_ip        String,
    auth_source_port      UInt16,
    auth_destination_ip   String,
    auth_destination_port UInt16,
    auth_transport        LowCardinality(String),
    auth_raw_record       String
)
ENGINE = ReplacingMergeTree
PARTITION BY toYYYYMM(event_time)
ORDER BY (tenant_id, event_time, event_id)
TTL toDateTime(event_time) + INTERVAL 365 DAY DELETE
SETTINGS index_granularity = 8192

```

## clickhouse: 0002_security_detections.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/clickhouse/schema/0002_security_detections.sql)

```sql
-- One row per detection, projected from the contract by internal/detectionstore.
-- Nothing is Nullable: absence is the zero value, as in proto3.
-- One column per line, name first: internal/clickhouse reads this file to check
-- the adapter inserts into exactly these columns, in this order.
--
-- Detections and alerts are not the same table and never will be. A detection is
-- immutable and analytical; an alert is mutable, has an owner and a lifecycle,
-- and belongs in a relational store that does not exist yet. v1 kept both in one
-- `alerts` table and could not write an analytical result without touching a row
-- an operator owned.

CREATE TABLE IF NOT EXISTS security_detections
(
    detection_id           String,
    schema_version         UInt32,

    rule_id                LowCardinality(String),
    rule_revision          UInt32,
    rule_name              String,
    rule_source_catalogue  LowCardinality(String),
    rule_source_identifier String,
    ruleset_id             LowCardinality(String),

    severity               LowCardinality(String),
    technique_tactic       LowCardinality(String),
    technique_id           LowCardinality(String),
    technique_name         String,

    event_class            LowCardinality(String),
    tenant_id              LowCardinality(String),
    agent_id               LowCardinality(String),
    host_hostname          String,
    host_ip                String,
    host_os                LowCardinality(String),
    host_architecture      LowCardinality(String),

    source_event_ids       Array(String),
    event_time             DateTime64(3, 'UTC'),
    detected_time          DateTime64(3, 'UTC'),

    evidence_field         Array(String),
    evidence_operator      Array(String),
    evidence_negated       Array(Bool),
    evidence_held          Array(String),
    evidence_absent        Array(Bool)
)
ENGINE = ReplacingMergeTree
PARTITION BY toYYYYMM(event_time)
ORDER BY (tenant_id, event_time, detection_id)
TTL toDateTime(event_time) + INTERVAL 730 DAY DELETE
SETTINGS index_granularity = 8192

```

## clickhouse: 0003_detection_aggregation.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/clickhouse/schema/0003_detection_aggregation.sql)

```sql
-- What a counting rule found, added to a table that already exists rather than
-- written into 0002: an estate that has been storing detections since before
-- thresholds existed must gain the columns without losing the rows.
--
-- Absence is the zero value, as in proto3, so a detection made by a rule that
-- counts nothing reads as a count of zero against a threshold of zero. The three
-- group arrays are one table read sideways, exactly as the evidence arrays are.

ALTER TABLE security_detections
    ADD COLUMN IF NOT EXISTS aggregation_count UInt32,
    ADD COLUMN IF NOT EXISTS aggregation_threshold UInt32,
    ADD COLUMN IF NOT EXISTS aggregation_window_seconds UInt32,
    ADD COLUMN IF NOT EXISTS aggregation_first_event_time DateTime64(3, 'UTC'),
    ADD COLUMN IF NOT EXISTS aggregation_saturated Bool,
    ADD COLUMN IF NOT EXISTS aggregation_group_field Array(String),
    ADD COLUMN IF NOT EXISTS aggregation_group_value Array(String),
    ADD COLUMN IF NOT EXISTS aggregation_group_absent Array(Bool)

```

## clickhouse: 0004_detection_correlation.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/clickhouse/schema/0004_detection_correlation.sql)

```sql
-- What an ordered rule found, added to the table the same way 0003 added what a
-- counting rule found: an estate storing detections from before sequences
-- existed gains the columns without losing the rows.
--
-- A row naming no stage is a detection made by a rule that orders nothing, so
-- absence needs no flag of its own. The stage arrays are one table read
-- sideways, exactly as the evidence and group arrays are, and they are ordered
-- as the rule declares its stages rather than by anything the store decides.

ALTER TABLE security_detections
    ADD COLUMN IF NOT EXISTS correlation_window_seconds UInt32,
    ADD COLUMN IF NOT EXISTS correlation_clock_spread_millis Int64,
    ADD COLUMN IF NOT EXISTS correlation_stage_name Array(String),
    ADD COLUMN IF NOT EXISTS correlation_stage_event_id Array(String),
    ADD COLUMN IF NOT EXISTS correlation_stage_event_time Array(DateTime64(3, 'UTC')),
    ADD COLUMN IF NOT EXISTS correlation_group_field Array(String),
    ADD COLUMN IF NOT EXISTS correlation_group_value Array(String),
    ADD COLUMN IF NOT EXISTS correlation_group_absent Array(Bool)

```

## clickhouse: 0005_asset_inventory.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/clickhouse/schema/0005_asset_inventory.sql)

```sql
-- One row per thing an asset currently has, projected from the contract by
-- internal/inventorystore. Nothing is Nullable: absence is the zero value, as in
-- proto3. One column per line, name first: internal/clickhouse reads this file to
-- check the adapter inserts into exactly these columns, in this order.
--
-- There is no PARTITION BY. ReplacingMergeTree collapses rows of one key only
-- within a partition, and every candidate to partition by here is a time that
-- moves as the item is observed again, so partitioning would leave one installed
-- package as a row per month that no merge ever reconciles.
--
-- The version is last_seen, which is the collector's own clock: a record that
-- reaches the store late, out of the order it was written in, loses to the newer
-- one it arrives behind rather than overwriting it.
--
-- Whether an item is still installed is not a column. The current items of one
-- kind on one asset are those whose last_seen is at or after the scanned_at that
-- asset_inventory_scans holds for it, so an item a full scan stopped naming
-- falls out of the answer without a delete, a tombstone or a second write.

CREATE TABLE IF NOT EXISTS asset_inventory
(
    tenant_id                   LowCardinality(String),
    agent_id                    LowCardinality(String),
    kind                        LowCardinality(String),
    item_id                     String,

    last_seen                   DateTime64(3, 'UTC'),
    mode                        LowCardinality(String),
    record_id                   String,
    schema_version              UInt32,

    host_hostname               String,
    host_ip                     String,
    host_os                     LowCardinality(String),
    host_architecture           LowCardinality(String),

    collector                   LowCardinality(String),
    source                      String,
    sequence                    UInt64,

    gateway                     LowCardinality(String),
    batch_id                    String,
    ingest_time                 DateTime64(3, 'UTC'),

    os_name                     String,
    os_version                  String,
    os_build                    String,
    os_platform                 LowCardinality(String),
    os_codename                 LowCardinality(String),
    os_family                   LowCardinality(String),

    kernel_name                 String,
    kernel_release              String,
    kernel_version              String,
    kernel_architecture         LowCardinality(String),

    package_name                String,
    package_version             String,
    package_architecture        LowCardinality(String),
    package_manager             LowCardinality(String),
    package_source              String,
    package_vendor              String,
    package_size_bytes          UInt64,
    package_installed_at        DateTime64(3, 'UTC'),

    service_name                String,
    service_display_name        String,
    service_state               LowCardinality(String),
    service_start_mode          LowCardinality(String),
    service_path                String,

    interface_name              String,
    interface_mac               String,
    interface_addresses         Array(String),
    interface_state             LowCardinality(String),
    interface_mtu               UInt32,
    interface_type              LowCardinality(String),

    user_name                   String,
    user_uid                    String,
    user_gid                    String,
    user_home                   String,
    user_shell                  String,
    user_groups                 Array(String),
    user_last_login             DateTime64(3, 'UTC'),

    hardware_cpu_name           String,
    hardware_cpu_cores          UInt32,
    hardware_cpu_mhz            UInt32,
    hardware_memory_total_bytes UInt64,
    hardware_serial             String,
    hardware_vendor             String,
    hardware_model              String,

    process_pid                 UInt32,
    process_parent_pid          UInt32,
    process_name                String,
    process_path                String,
    process_command_line        String,
    process_user                String,
    process_started_at          DateTime64(3, 'UTC')
)
ENGINE = ReplacingMergeTree(last_seen)
ORDER BY (tenant_id, agent_id, kind, item_id)
TTL toDateTime(last_seen) + INTERVAL 365 DAY DELETE
SETTINGS index_granularity = 8192;

-- When one asset's inventory of one kind was last enumerated in full, which is
-- the only thing that makes absence mean anything: a delta says nothing about
-- what it omits, so only a snapshot moves this line, and an empty snapshot moves
-- it too, which is how a collector says the asset has none of that kind left.
--
-- It is also the staleness of the answer: an asset whose scanned_at is nine days
-- old is reporting a nine-day-old package list, and the reader can see that
-- rather than assume it is current.

CREATE TABLE IF NOT EXISTS asset_inventory_scans
(
    tenant_id  LowCardinality(String),
    agent_id   LowCardinality(String),
    kind       LowCardinality(String),
    scanned_at DateTime64(3, 'UTC'),
    record_id  String,
    items      UInt32
)
ENGINE = ReplacingMergeTree(scanned_at)
ORDER BY (tenant_id, agent_id, kind)
TTL toDateTime(scanned_at) + INTERVAL 365 DAY DELETE
SETTINGS index_granularity = 8192

```

## clickhouse: 0006_vulnerability_advisories.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/clickhouse/schema/0006_vulnerability_advisories.sql)

```sql
-- One row per version of an advisory the platform has read, projected from the
-- contract by internal/advisorystore. Nothing is Nullable: absence is the zero
-- value, as in proto3, and an instant nobody gave is the epoch. One column per
-- line, name first: internal/clickhouse reads this file to check the adapter
-- inserts into exactly these columns, in this order.
--
-- A version is named by the source, the id there, the moment the source last
-- changed it and the rules the platform read it with, and every one of those is
-- in the sort key. Nothing ever replaces another version: the engine only
-- collapses a version written twice, which is what a replay does, and when it
-- does the reading fetched last is the one kept. The newest version of an
-- advisory is the one with the greatest modified, read with the greatest
-- normalization that version was stored under.
--
-- There is no PARTITION BY and no TTL. Intelligence is kept for as long as the
-- platform runs, because a finding made from a version of it has to stay
-- explicable after the source has moved on, and a withdrawal is a newer version
-- rather than a delete.

CREATE TABLE IF NOT EXISTS vulnerability_advisories
(
    source             LowCardinality(String),
    advisory_id        String,
    modified           DateTime64(9, 'UTC'),
    normalization      UInt32,

    schema_version     UInt32,
    published          DateTime64(3, 'UTC'),
    withdrawn          DateTime64(3, 'UTC'),

    aliases            Array(String),
    upstream           Array(String),
    related            Array(String),

    summary            String,
    details            String,

    severity_types     Array(LowCardinality(String)),
    severity_scores    Array(String),
    severity_assessors Array(LowCardinality(String)),

    affected           UInt32,

    feed               LowCardinality(String),
    feed_version       String,
    location           String,
    fetched_at         DateTime64(3, 'UTC'),
    digest             String,
    format             LowCardinality(String)
)
ENGINE = ReplacingMergeTree(fetched_at)
ORDER BY (source, advisory_id, modified, normalization)
SETTINGS index_granularity = 8192;

-- One row per package a version of an advisory affects, ordered the way a
-- matcher asks: which advisories name this package in this release. Ranges and
-- their events are parallel arrays rather than a document, because a version
-- and what kind of boundary it is are both worth reading without a parser;
-- event_ranges says which range each event belongs to, in the order the source
-- wrote them. Withdrawal is carried on every row, so a reader that comes by
-- package drops a withdrawn advisory without a join.

CREATE TABLE IF NOT EXISTS vulnerability_affected
(
    ecosystem          LowCardinality(String),
    package            String,
    source             LowCardinality(String),
    advisory_id        String,
    modified           DateTime64(9, 'UTC'),
    normalization      UInt32,
    entry              UInt32,

    range_types        Array(LowCardinality(String)),
    event_ranges       Array(UInt32),
    event_kinds        Array(LowCardinality(String)),
    event_versions     Array(String),
    versions           Array(String),

    severity_types     Array(LowCardinality(String)),
    severity_scores    Array(String),
    severity_assessors Array(LowCardinality(String)),

    withdrawn          DateTime64(3, 'UTC')
)
ENGINE = ReplacingMergeTree
ORDER BY (ecosystem, package, source, advisory_id, modified, normalization, entry)
SETTINGS index_granularity = 8192;

-- One row per attempt to follow a feed. The newest row of a feed says how old
-- the platform's copy of it is, synced_at, and how current the feed itself is,
-- newest_listed; a failed attempt carries the last synced_at forward, so the
-- freshness of intelligence never looks better than it is.

CREATE TABLE IF NOT EXISTS vulnerability_feed_syncs
(
    source        LowCardinality(String),
    feed          LowCardinality(String),
    checked_at    DateTime64(3, 'UTC'),
    outcome       LowCardinality(String),
    synced_at     DateTime64(3, 'UTC'),
    newest_listed DateTime64(3, 'UTC'),
    feed_version  String,
    listed        UInt32,
    held          UInt32,
    published     UInt32,
    refused       UInt32,
    failure       String
)
ENGINE = ReplacingMergeTree
ORDER BY (source, feed, checked_at)
TTL toDateTime(checked_at) + INTERVAL 365 DAY DELETE
SETTINGS index_granularity = 8192

```

## postgres: 0001_alerts.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/postgres/schema/0001_alerts.sql)

```sql
CREATE TABLE IF NOT EXISTS alerts
(
    alert_id               TEXT        PRIMARY KEY,
    schema_version         INTEGER     NOT NULL,
    tenant_id              TEXT        NOT NULL,
    detection_id           TEXT        NOT NULL,

    rule_id                TEXT        NOT NULL,
    rule_revision          BIGINT      NOT NULL,
    rule_name              TEXT        NOT NULL DEFAULT '',
    rule_source_catalogue  TEXT        NOT NULL DEFAULT '',
    rule_source_identifier TEXT        NOT NULL DEFAULT '',

    severity               TEXT        NOT NULL DEFAULT '',
    technique_tactic       TEXT        NOT NULL DEFAULT '',
    technique_id           TEXT        NOT NULL DEFAULT '',
    technique_name         TEXT        NOT NULL DEFAULT '',

    event_class            TEXT        NOT NULL DEFAULT '',
    agent_id               TEXT        NOT NULL DEFAULT '',

    event_time             TIMESTAMPTZ,
    raised_at              TIMESTAMPTZ NOT NULL,

    state                  TEXT        NOT NULL,
    assignee               TEXT        NOT NULL DEFAULT '',
    changed_by             TEXT        NOT NULL,
    changed_at             TIMESTAMPTZ NOT NULL,
    revision               BIGINT      NOT NULL CHECK (revision > 0),

    closure_state          TEXT        NOT NULL DEFAULT '',
    closure_reason         TEXT        NOT NULL DEFAULT '',
    closure_by             TEXT        NOT NULL DEFAULT '',
    closure_at             TIMESTAMPTZ
);

-- The tenant is the first column of every read: a scope is not a filter a
-- caller supplies, so an alert is never reached without one.
CREATE INDEX IF NOT EXISTS alerts_by_age    ON alerts (tenant_id, raised_at DESC, alert_id DESC);
CREATE INDEX IF NOT EXISTS alerts_by_state  ON alerts (tenant_id, state, raised_at DESC);
CREATE INDEX IF NOT EXISTS alerts_by_holder ON alerts (tenant_id, assignee, raised_at DESC) WHERE assignee <> '';

-- Append only, and one row per revision, so the trail cannot lose a line to a
-- retry and cannot grow one that never happened.
CREATE TABLE IF NOT EXISTS alert_transitions
(
    alert_id   TEXT        NOT NULL REFERENCES alerts (alert_id) ON DELETE CASCADE,
    revision   BIGINT      NOT NULL CHECK (revision > 0),
    from_state TEXT        NOT NULL DEFAULT '',
    to_state   TEXT        NOT NULL,
    assignee   TEXT        NOT NULL DEFAULT '',
    actor      TEXT        NOT NULL,
    at         TIMESTAMPTZ NOT NULL,
    note       TEXT        NOT NULL DEFAULT '',

    PRIMARY KEY (alert_id, revision)
);

```

## postgres: 0002_alert_correlation.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/postgres/schema/0002_alert_correlation.sql)

```sql
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS correlation_key TEXT   NOT NULL DEFAULT '';
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS occurrences     BIGINT NOT NULL DEFAULT 1 CHECK (occurrences > 0);
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS first_seen      TIMESTAMPTZ;
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS last_seen       TIMESTAMPTZ;

-- An alert raised before folding existed is made of exactly one detection and
-- keyed by itself, so it folds with nothing rather than with everything.
UPDATE alerts SET correlation_key = alert_id WHERE correlation_key = '';
UPDATE alerts SET first_seen = COALESCE(event_time, raised_at) WHERE first_seen IS NULL;
UPDATE alerts SET last_seen  = COALESCE(event_time, raised_at) WHERE last_seen  IS NULL;

ALTER TABLE alerts ALTER COLUMN first_seen SET NOT NULL;
ALTER TABLE alerts ALTER COLUMN last_seen  SET NOT NULL;

-- Deliberately not unique. A window bounds how much one alert absorbs, so
-- activity that resumes long after the last of it is a new piece of work rather
-- than an unbounded count on an old one.
CREATE INDEX IF NOT EXISTS alerts_open_by_key
    ON alerts (tenant_id, correlation_key, last_seen DESC)
    WHERE state NOT IN ('resolved', 'false_positive');

CREATE INDEX IF NOT EXISTS alerts_closed_by_key
    ON alerts (tenant_id, correlation_key, closure_at DESC)
    WHERE state IN ('resolved', 'false_positive');

-- Every detection an alert is made of. Folding raises a count and discards
-- nothing: an investigation reads these to reach the evidence behind the count.
CREATE TABLE IF NOT EXISTS alert_occurrences
(
    alert_id     TEXT        NOT NULL REFERENCES alerts (alert_id) ON DELETE CASCADE,
    detection_id TEXT        NOT NULL,
    event_time   TIMESTAMPTZ NOT NULL,
    folded_at    TIMESTAMPTZ NOT NULL,

    PRIMARY KEY (alert_id, detection_id)
);

-- A detection belongs to at most one alert anywhere, which is what makes a
-- replayed batch fold nothing a second time.
CREATE UNIQUE INDEX IF NOT EXISTS alert_occurrences_by_detection ON alert_occurrences (detection_id);

INSERT INTO alert_occurrences (alert_id, detection_id, event_time, folded_at)
SELECT alert_id, detection_id, COALESCE(event_time, raised_at), raised_at FROM alerts
ON CONFLICT DO NOTHING;

```

## postgres: 0003_incidents.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/postgres/schema/0003_incidents.sql)

```sql
-- A story is not an alert, so it is not a row in the alerts table. An alert is
-- one detection somebody owns; an incident is what several events came to
-- together, and it carries what no alert has: the stages, the span they cover,
-- and how far the clocks that ordered them stood apart.
CREATE TABLE IF NOT EXISTS incidents
(
    incident_id            TEXT          PRIMARY KEY,
    schema_version         INTEGER       NOT NULL,
    tenant_id              TEXT          NOT NULL,
    detection_id           TEXT          NOT NULL,

    rule_id                TEXT          NOT NULL,
    rule_revision          BIGINT        NOT NULL,
    rule_name              TEXT          NOT NULL DEFAULT '',
    rule_source_catalogue  TEXT          NOT NULL DEFAULT '',
    rule_source_identifier TEXT          NOT NULL DEFAULT '',
    ruleset_id             TEXT          NOT NULL DEFAULT '',

    severity               TEXT          NOT NULL DEFAULT '',
    confidence             TEXT          NOT NULL DEFAULT '',
    technique_tactic       TEXT          NOT NULL DEFAULT '',
    technique_id           TEXT          NOT NULL DEFAULT '',
    technique_name         TEXT          NOT NULL DEFAULT '',

    event_class            TEXT          NOT NULL DEFAULT '',
    agent_id               TEXT          NOT NULL DEFAULT '',

    stage_name             TEXT[]        NOT NULL,
    stage_event_id         TEXT[]        NOT NULL,
    stage_event_time       TIMESTAMPTZ[] NOT NULL,

    group_field            TEXT[]        NOT NULL DEFAULT '{}',
    group_value            TEXT[]        NOT NULL DEFAULT '{}',
    group_absent           BOOLEAN[]     NOT NULL DEFAULT '{}',

    window_seconds         BIGINT        NOT NULL DEFAULT 0,
    clock_spread_millis    BIGINT        NOT NULL DEFAULT 0,

    first_event_time       TIMESTAMPTZ   NOT NULL,
    last_event_time        TIMESTAMPTZ   NOT NULL,
    raised_at              TIMESTAMPTZ   NOT NULL,

    state                  TEXT          NOT NULL,
    assignee               TEXT          NOT NULL DEFAULT '',
    changed_by             TEXT          NOT NULL,
    changed_at             TIMESTAMPTZ   NOT NULL,
    revision               BIGINT        NOT NULL CHECK (revision > 0),

    closure_state          TEXT          NOT NULL DEFAULT '',
    closure_reason         TEXT          NOT NULL DEFAULT '',
    closure_by             TEXT          NOT NULL DEFAULT '',
    closure_at             TIMESTAMPTZ,

    -- The stage arrays are one table read sideways, so they are the same length
    -- or the story names an event no stage owns. A story with no stage at all is
    -- not a story and never reaches here.
    CHECK (cardinality(stage_name) > 0),
    CHECK (cardinality(stage_name) = cardinality(stage_event_id)),
    CHECK (cardinality(stage_name) = cardinality(stage_event_time)),
    CHECK (cardinality(group_field) = cardinality(group_value)),
    CHECK (cardinality(group_field) = cardinality(group_absent))
);

-- The tenant is the first column of every read: a scope is not a filter a
-- caller supplies, so an incident is never reached without one.
CREATE INDEX IF NOT EXISTS incidents_by_age    ON incidents (tenant_id, raised_at DESC, incident_id DESC);
CREATE INDEX IF NOT EXISTS incidents_by_state  ON incidents (tenant_id, state, raised_at DESC);
CREATE INDEX IF NOT EXISTS incidents_by_holder ON incidents (tenant_id, assignee, raised_at DESC) WHERE assignee <> '';

-- Append only, and one row per revision, so the trail cannot lose a line to a
-- retry and cannot grow one that never happened.
CREATE TABLE IF NOT EXISTS incident_transitions
(
    incident_id TEXT        NOT NULL REFERENCES incidents (incident_id) ON DELETE CASCADE,
    revision    BIGINT      NOT NULL CHECK (revision > 0),
    from_state  TEXT        NOT NULL DEFAULT '',
    to_state    TEXT        NOT NULL,
    assignee    TEXT        NOT NULL DEFAULT '',
    actor       TEXT        NOT NULL,
    at          TIMESTAMPTZ NOT NULL,
    note        TEXT        NOT NULL DEFAULT '',

    PRIMARY KEY (incident_id, revision)
);

```

## postgres: 0004_agents.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/postgres/schema/0004_agents.sql)

```sql
CREATE TABLE IF NOT EXISTS agents
(
    agent_id              TEXT        PRIMARY KEY,
    schema_version        INTEGER     NOT NULL,
    tenant_id             TEXT        NOT NULL,

    state                 TEXT        NOT NULL,

    platform_os           TEXT        NOT NULL DEFAULT '',
    platform_architecture TEXT        NOT NULL DEFAULT '',
    platform_hostname     TEXT        NOT NULL DEFAULT '',
    agent_version         TEXT        NOT NULL DEFAULT '',

    identity_subject      TEXT        NOT NULL DEFAULT '',
    identity_serial       TEXT        NOT NULL DEFAULT '',
    identity_fingerprint  TEXT        NOT NULL DEFAULT '',
    identity_issued_at    TIMESTAMPTZ,
    identity_expires_at   TIMESTAMPTZ,

    registered_at         TIMESTAMPTZ NOT NULL,
    changed_by            TEXT        NOT NULL,
    changed_at            TIMESTAMPTZ NOT NULL,
    revision              BIGINT      NOT NULL CHECK (revision > 0),

    -- What the data plane has been told. The registry is written first and the
    -- admission log after it, so a row where this trails `revision` is a
    -- decision the gateway has not heard and is published again rather than
    -- lost.
    published_revision    BIGINT      NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS agents_unannounced
    ON agents (changed_at) WHERE published_revision < revision;

-- The tenant is the first column of every read: a scope is not a filter a
-- caller supplies, so an agent is never reached without one.
CREATE INDEX IF NOT EXISTS agents_by_name  ON agents (tenant_id, agent_id);
CREATE INDEX IF NOT EXISTS agents_by_state ON agents (tenant_id, state, agent_id);

-- One certificate belongs to one agent. Two agents claiming the same
-- fingerprint would make a revocation ambiguous, and an operator binding a
-- certificate that is already somebody else's is refused rather than recorded.
CREATE UNIQUE INDEX IF NOT EXISTS agents_by_certificate
    ON agents (identity_fingerprint) WHERE identity_fingerprint <> '';

-- Append only, and one row per revision, so the trail cannot lose a line to a
-- retry and cannot grow one that never happened.
CREATE TABLE IF NOT EXISTS agent_transitions
(
    agent_id   TEXT        NOT NULL REFERENCES agents (agent_id) ON DELETE CASCADE,
    revision   BIGINT      NOT NULL CHECK (revision > 0),
    from_state TEXT        NOT NULL DEFAULT '',
    to_state   TEXT        NOT NULL,
    actor      TEXT        NOT NULL,
    at         TIMESTAMPTZ NOT NULL,
    note       TEXT        NOT NULL DEFAULT '',

    PRIMARY KEY (agent_id, revision)
);

```

## postgres: 0005_agent_certificates.sql

[Canonical source](https://github.com/dynasmon/Seagull-backend-v2/blob/fa3bf69023db0168832346c50bd353ca4188b87a/internal/postgres/schema/0005_agent_certificates.sql)

```sql
-- Every certificate the platform signed for an agent, append only. The registry
-- row carries the one that is current; this carries the ones that were, so which
-- key a machine held at a past moment survives a renewal.
CREATE TABLE IF NOT EXISTS agent_certificates
(
    fingerprint       TEXT        PRIMARY KEY,
    agent_id          TEXT        NOT NULL REFERENCES agents (agent_id) ON DELETE CASCADE,
    serial            TEXT        NOT NULL,
    subject           TEXT        NOT NULL,
    authority_subject TEXT        NOT NULL DEFAULT '',
    issued_by         TEXT        NOT NULL,
    issued_at         TIMESTAMPTZ NOT NULL,
    expires_at        TIMESTAMPTZ NOT NULL,
    superseded_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS agent_certificates_by_agent
    ON agent_certificates (agent_id, issued_at DESC);

-- An agent holds one current certificate, so superseding the one before it is
-- part of issuing rather than a sweep somebody has to remember to run.
CREATE UNIQUE INDEX IF NOT EXISTS agent_certificates_current
    ON agent_certificates (agent_id) WHERE superseded_at IS NULL;

```

