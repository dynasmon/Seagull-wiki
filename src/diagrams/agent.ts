import { defineFlow } from '@site/src/components/FlowDiagram/layout';
import { defineSequence } from '@site/src/components/SequenceDiagram/model';

export const agentTarget = defineFlow({
  title: 'Target agent pipeline from operating system sources to the gateway',
  caption:
    'Dashed boxes are planned agent components. Configuration and the key provider exist today; the gateway and its topics are implemented in the backend.',
  grid: {
    columns: [160, 168, 146, 156],
    rows: 6.5,
    rowHeight: 54,
    rowGap: 28,
    columnGap: 38,
    margin: { x: 26, y: 34 },
  },
  nodes: {
    os: {
      label: 'Operating system sources',
      kind: 'actor',
      col: 1,
      row: 0,
    },
    config: {
      label: 'Validated configuration',
      detail: 'signed policy planned',
      kind: 'process',
      col: 0,
      row: 1,
    },
    collectors: {
      label: 'Configured collectors',
      kind: 'process',
      col: 1,
      row: 1,
      planned: true,
    },
    admission: {
      label: 'Bounded typed admission',
      kind: 'process',
      col: 1,
      row: 2,
      planned: true,
    },
    spool: {
      label: 'Durable spool',
      kind: 'process',
      col: 1,
      row: 3,
      planned: true,
    },
    delivery: {
      label: 'Delivery and retry',
      kind: 'process',
      col: 1,
      row: 4,
      planned: true,
    },
    identity: {
      label: 'Installation and key provider',
      kind: 'process',
      col: 0,
      row: 5,
    },
    transport: {
      label: 'mTLS transport',
      kind: 'process',
      col: 1,
      row: 5,
      planned: true,
    },
    gateway: { label: 'ingest-gateway', kind: 'process', col: 2, row: 5 },
    events: { label: 'security.events.raw', kind: 'topic', col: 3, row: 4.5 },
    inventory: {
      label: 'security.inventory.raw',
      kind: 'topic',
      col: 3,
      row: 5.5,
    },
  },
  edges: [
    { from: 'os', to: 'collectors' },
    { from: 'config', to: 'collectors', kind: 'control' },
    { from: 'collectors', to: 'admission' },
    { from: 'admission', to: 'spool' },
    { from: 'spool', to: 'delivery', exitAt: 0.3 },
    {
      from: 'delivery',
      to: 'spool',
      kind: 'ack',
      exitAt: 0.7,
      label: 'acknowledgement state',
      labelSide: 'left',
    },
    { from: 'delivery', to: 'transport' },
    { from: 'identity', to: 'transport', kind: 'control' },
    { from: 'transport', to: 'gateway' },
    { from: 'gateway', to: 'events' },
    { from: 'gateway', to: 'inventory' },
    {
      from: 'gateway',
      to: 'delivery',
      kind: 'ack',
      exit: 'top',
      enter: 'right',
      label: 'durable ACK',
      labelSide: 'right',
    },
  ],
  groups: [
    {
      label: 'Endpoint · Seagull agent',
      tone: 'endpoint',
      cols: [0, 1],
      rows: [0, 5],
    },
    {
      label: 'Backend · implemented',
      tone: 'backend',
      cols: [2, 3],
      rows: [4, 5.5],
    },
  ],
  legend: {
    process: 'Component',
    actor: 'Host',
    control: 'Configuration and signing',
  },
});

export const deliveryAcknowledgement = defineSequence({
  title: 'Planned delivery completes only on a matched durable ACK',
  participants: {
    spool: { label: 'Spool', detail: 'planned', planned: true },
    delivery: { label: 'Delivery', detail: 'planned', planned: true },
    gateway: { label: 'ingest-gateway', detail: 'implemented' },
  },
  steps: [
    {
      from: 'spool',
      to: 'delivery',
      label: 'Stable records and original IDs',
    },
    { from: 'delivery', to: 'gateway', label: 'mTLS batch' },
    {
      alt: [
        {
          when: 'Matched durable ACK with full count',
          steps: [
            { from: 'gateway', to: 'delivery', label: 'BatchAck', reply: true },
            {
              from: 'delivery',
              to: 'spool',
              label: 'Persist acknowledgement state',
            },
            { at: 'spool', label: 'Reclaim acknowledged records' },
          ],
        },
        {
          when: 'Timeout, refusal, or incomplete ACK',
          steps: [
            { from: 'delivery', to: 'spool', label: 'Keep records' },
            { at: 'delivery', label: 'Classify failure and schedule retry' },
          ],
        },
      ],
    },
  ],
});
