import { defineFlow } from '@site/src/components/FlowDiagram/layout';
import { defineSequence } from '@site/src/components/SequenceDiagram/model';

export const systemOverview = defineFlow({
  title: 'Implemented Seagull V2 backend processes and data flows',
  caption:
    'Read from top to bottom: producers, the gateway and importer that admit data, durable Redpanda topics, the consumers that process them, and the stores they write.',
  grid: {
    columns: [136, 136, 136, 136, 136],
    rows: 8,
    rowHeight: 58,
    rowGap: 34,
    columnGap: 24,
  },
  nodes: {
    client: {
      label: 'Authenticated telemetry client',
      detail: 'such as the development probe',
      kind: 'actor',
      col: 2,
      cols: 2,
      row: 0,
    },
    osv: {
      label: 'OSV distribution exports',
      kind: 'actor',
      col: 4,
      row: 0,
    },
    control: {
      label: 'control-api',
      detail: 'control plane',
      kind: 'process',
      col: 0,
      row: 1,
    },
    gateway: {
      label: 'ingest-gateway',
      detail: 'verified identity · durable ACK',
      kind: 'process',
      col: 2,
      cols: 2,
      row: 1,
    },
    importer: { label: 'advisory-importer', kind: 'process', col: 4, row: 1 },
    rulesets: { label: 'security.rulesets', kind: 'topic', col: 0, row: 2 },
    agents: { label: 'security.agents', kind: 'topic', col: 1, row: 2 },
    events: { label: 'security.events.raw', kind: 'topic', col: 2, row: 2 },
    inventory: {
      label: 'security.inventory.raw',
      kind: 'topic',
      col: 3,
      row: 2,
    },
    advisories: { label: 'security.advisories', kind: 'topic', col: 4, row: 2 },
    analysis: {
      label: 'analysis-engine',
      detail: 'normalize · detect',
      kind: 'process',
      col: 1,
      row: 3,
    },
    eventWriter: { label: 'event-writer', kind: 'process', col: 2, row: 3 },
    projector: {
      label: 'inventory-projector',
      kind: 'process',
      col: 3,
      row: 3,
    },
    advisoryWriter: {
      label: 'advisory-writer',
      kind: 'process',
      col: 4,
      row: 3,
    },
    detections: { label: 'security.detections', kind: 'topic', col: 1, row: 4 },
    alertWriter: {
      label: 'alert-writer',
      detail: 'alerts · incidents',
      kind: 'process',
      col: 0,
      row: 5,
    },
    detectionWriter: {
      label: 'detection-writer',
      kind: 'process',
      col: 1,
      row: 5,
    },
    postgres: {
      label: 'PostgreSQL',
      detail: 'alerts · registry',
      kind: 'store',
      col: 0,
      row: 6,
    },
    clickhouse: {
      label: 'ClickHouse',
      detail: 'events · detections · inventory · advisories',
      kind: 'store',
      col: 1,
      cols: 4,
      row: 6,
    },
    query: {
      label: 'query-api',
      detail: 'read-only, tenant-scoped',
      kind: 'process',
      col: 2,
      cols: 2,
      row: 7,
    },
  },
  edges: [
    { from: 'client', to: 'gateway', label: 'mTLS · Protobuf' },
    { from: 'gateway', to: 'events' },
    { from: 'gateway', to: 'inventory' },
    { from: 'osv', to: 'importer' },
    { from: 'importer', to: 'advisories' },
    { from: 'control', to: 'rulesets', kind: 'control' },
    { from: 'control', to: 'agents', kind: 'control' },
    {
      from: 'agents',
      to: 'gateway',
      kind: 'control',
      exit: 'top',
      enter: 'left',
    },
    {
      from: 'control',
      to: 'postgres',
      kind: 'control',
      exit: 'left',
      enter: 'left',
      channel: 0,
    },
    { from: 'rulesets', to: 'analysis', kind: 'control' },
    { from: 'events', to: 'analysis' },
    { from: 'events', to: 'eventWriter' },
    { from: 'inventory', to: 'projector' },
    { from: 'advisories', to: 'advisoryWriter' },
    { from: 'analysis', to: 'detections' },
    { from: 'detections', to: 'alertWriter' },
    { from: 'detections', to: 'detectionWriter' },
    { from: 'alertWriter', to: 'postgres' },
    { from: 'detectionWriter', to: 'clickhouse' },
    { from: 'eventWriter', to: 'clickhouse' },
    { from: 'projector', to: 'clickhouse' },
    { from: 'advisoryWriter', to: 'clickhouse' },
    { from: 'query', to: 'clickhouse', label: 'scoped reads' },
  ],
  legend: {
    process: 'Seagull process',
    data: 'Data flow',
    control: 'Control-plane publication',
  },
});

export const repositoryDependencies = defineFlow({
  title: 'Dependency direction between the Seagull repositories',
  grid: {
    columns: [190, 190, 190],
    rows: 3,
    rowHeight: 56,
    rowGap: 44,
    columnGap: 44,
  },
  nodes: {
    contracts: {
      label: 'Versioned contracts',
      detail: 'Seagull-contracts',
      kind: 'process',
      col: 1,
      row: 0,
    },
    backend: {
      label: 'Backend',
      detail: 'Seagull-backend-v2',
      kind: 'process',
      col: 0,
      row: 1,
    },
    agent: {
      label: 'Agent',
      detail: 'Seagull-agent-v2',
      kind: 'process',
      col: 2,
      row: 1,
    },
    docs: {
      label: 'Documentation',
      detail: 'Seagull-wiki',
      kind: 'process',
      col: 1,
      row: 2,
    },
  },
  edges: [
    { from: 'backend', to: 'contracts', exit: 'top', enter: 'left' },
    { from: 'agent', to: 'contracts', exit: 'top', enter: 'right' },
    {
      from: 'docs',
      to: 'contracts',
      kind: 'control',
      label: 'reviewed snapshots',
    },
    {
      from: 'docs',
      to: 'backend',
      kind: 'control',
      exit: 'left',
      enter: 'bottom',
    },
    {
      from: 'docs',
      to: 'agent',
      kind: 'control',
      exit: 'right',
      enter: 'bottom',
    },
  ],
  legend: {
    process: 'Repository',
    data: 'Imports the published module',
    control: 'Reviewed source snapshot, not a build dependency',
  },
});

export const durableAdmission = defineSequence({
  title: 'Durable admission of an event batch',
  participants: {
    producer: { label: 'Telemetry producer', kind: 'actor' },
    gateway: { label: 'ingest-gateway' },
    redpanda: { label: 'Redpanda', kind: 'topic' },
  },
  steps: [
    { from: 'producer', to: 'gateway', label: 'EventBatch over verified mTLS' },
    {
      at: 'gateway',
      label: 'Resolve roster tenant; overwrite identity and reception',
    },
    { at: 'gateway', label: 'Validate the entire batch' },
    {
      from: 'gateway',
      to: 'redpanda',
      label: 'Publish, wait for all in-sync replicas',
    },
    {
      alt: [
        {
          when: 'All publication succeeded',
          steps: [
            {
              from: 'redpanda',
              to: 'gateway',
              label: 'Durable publication result',
              reply: true,
            },
            {
              from: 'gateway',
              to: 'producer',
              label: 'accepted=true, durable=true, received=count',
              reply: true,
            },
          ],
        },
        {
          when: 'Timeout or partial failure',
          steps: [
            {
              from: 'gateway',
              to: 'producer',
              label: '503; retain and retry the batch',
              reply: true,
            },
          ],
        },
      ],
    },
  ],
});

export const downstreamEffects = defineSequence({
  title: 'A consumer commits its position after its durable effect',
  participants: {
    redpanda: { label: 'Redpanda', kind: 'topic' },
    consumer: { label: 'Consumer' },
    store: { label: 'Consumer-owned store', kind: 'store' },
  },
  steps: [
    { from: 'redpanda', to: 'consumer', label: 'Records, possibly repeated' },
    { from: 'consumer', to: 'store', label: 'Persist output or quarantine' },
    { from: 'store', to: 'consumer', label: 'Success', reply: true },
    { from: 'consumer', to: 'redpanda', label: 'Commit consumed offsets' },
  ],
});
