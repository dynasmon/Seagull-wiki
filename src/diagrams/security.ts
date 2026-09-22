import { defineFlow } from '@site/src/components/FlowDiagram/layout';
import { defineSequence } from '@site/src/components/SequenceDiagram/model';

export const operatorIssuance = defineSequence({
  title: 'Operator-mediated registration and certificate issuance',
  participants: {
    endpoint: {
      label: 'Endpoint',
      detail: 'provisioning workflow',
      kind: 'actor',
    },
    operator: { label: 'Authorized operator', kind: 'actor' },
    control: { label: 'control-api' },
    postgres: { label: 'PostgreSQL', kind: 'store' },
  },
  steps: [
    { at: 'endpoint', label: 'Generate key locally; create CSR' },
    {
      from: 'endpoint',
      to: 'operator',
      label: 'Transfer public CSR through the provisioning workflow',
      reply: true,
    },
    {
      from: 'operator',
      to: 'control',
      label: 'Register agent in permitted tenant',
    },
    { from: 'control', to: 'postgres', label: 'Pending identity' },
    {
      from: 'operator',
      to: 'control',
      label: 'Authorized certificate request with CSR',
    },
    {
      from: 'control',
      to: 'postgres',
      label: 'Signed certificate identity and active state',
    },
    {
      from: 'control',
      to: 'operator',
      label: 'Certificate and trust bundle',
      reply: true,
    },
    {
      from: 'operator',
      to: 'endpoint',
      label: 'Deliver public credential material',
      reply: true,
    },
  ],
});

export const admissionPropagation = defineSequence({
  title: 'An admission decision reaches the gateway through the log',
  participants: {
    control: { label: 'control-api' },
    topic: {
      label: 'security.agents',
      detail: 'admission topic',
      kind: 'topic',
    },
    gateway: { label: 'ingest-gateway' },
  },
  steps: [
    { from: 'control', to: 'topic', label: 'Admission revision' },
    { from: 'topic', to: 'gateway', label: 'Roster update' },
  ],
});

export const trustBoundaries = defineFlow({
  title:
    'Trust domains, the listeners that verify them, and the authorities behind them',
  caption:
    'control-api is one process in both trust domains: its renewal listener verifies agent certificates, and its control listener verifies operators.',
  grid: {
    columns: [150, 176, 176, 150],
    rows: 3,
    rowHeight: 58,
    rowGap: 64,
    columnGap: 36,
    margin: 34,
  },
  nodes: {
    key: {
      label: 'Endpoint private key',
      kind: 'actor',
      col: 0,
      cols: 2,
      row: 0,
    },
    operator: {
      label: 'Operator certificate and session',
      kind: 'actor',
      col: 2,
      cols: 2,
      row: 0,
    },
    gateway: {
      label: 'ingest-gateway',
      detail: 'verifies agent certificate',
      kind: 'process',
      col: 0,
      row: 1,
    },
    control: {
      label: 'control-api',
      detail: 'renewal listener · control listener',
      kind: 'process',
      col: 1,
      cols: 2,
      row: 1,
    },
    query: {
      label: 'query-api',
      detail: 'tenant from certificate',
      kind: 'process',
      col: 3,
      row: 1,
    },
    broker: {
      label: 'Redpanda',
      detail: 'broker authority boundary',
      kind: 'topic',
      col: 0,
      cols: 2,
      row: 2,
    },
    state: {
      label: 'PostgreSQL',
      detail: 'transactional control state',
      kind: 'store',
      col: 2,
      row: 2,
    },
    evidence: {
      label: 'ClickHouse',
      detail: 'analytical evidence',
      kind: 'store',
      col: 3,
      row: 2,
    },
  },
  edges: [
    { from: 'key', to: 'gateway', label: 'mTLS' },
    {
      from: 'key',
      to: 'control',
      exitCol: 1,
      label: 'mTLS · future agent client',
    },
    { from: 'operator', to: 'control', exitCol: 2 },
    { from: 'operator', to: 'query' },
    {
      from: 'control',
      to: 'broker',
      kind: 'control',
      exitCol: 1,
      label: 'admission decisions',
    },
    {
      from: 'broker',
      to: 'gateway',
      kind: 'control',
      enterAt: 0.28,
      label: 'replayed roster',
      labelAt: 0.3,
    },
    {
      from: 'gateway',
      to: 'broker',
      exitAt: 0.72,
      label: 'stamped telemetry',
      labelAt: 0.3,
    },
    { from: 'control', to: 'state', exitCol: 2 },
    { from: 'query', to: 'evidence' },
  ],
  groups: [
    {
      label: 'Agent trust domain',
      tone: 'endpoint',
      cols: [0, 1],
      rows: [0, 1],
    },
    {
      label: 'Operator trust domain',
      tone: 'operator',
      cols: [2, 3],
      rows: [0, 1],
      labelPosition: 'top-right',
    },
  ],
  legend: {
    actor: 'Credential holder',
    process: 'Listener process',
    topic: 'Broker',
    store: 'Store',
    control: 'Admission and roster',
  },
});
