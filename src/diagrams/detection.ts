import { defineFlow } from '@site/src/components/FlowDiagram/layout';

export const detectionPipeline = defineFlow({
  title: 'From a raw authentication event to durable detection output',
  direction: 'right',
  grid: {
    columns: [118, 112, 128, 112, 122, 120],
    rows: 3,
    rowHeight: 64,
    rowGap: 22,
    columnGap: 26,
    margin: { x: 20, y: 36 },
  },
  nodes: {
    raw: {
      label: 'Raw event',
      detail: 'authentication',
      kind: 'topic',
      col: 0,
      row: 1,
    },
    normalize: {
      label: 'Canonical working form',
      kind: 'process',
      col: 1,
      row: 1,
    },
    evaluate: {
      label: 'Compiled rules + bounded state',
      kind: 'process',
      col: 2,
      row: 1,
    },
    detection: {
      label: 'Detection with evidence',
      kind: 'process',
      col: 3,
      row: 1,
    },
    ruleset: {
      label: 'Published ruleset',
      kind: 'topic',
      col: 2,
      row: 2,
    },
    log: { label: 'security.detections', kind: 'topic', col: 4, row: 1 },
    evidence: {
      label: 'Analytical evidence',
      kind: 'store',
      col: 5,
      row: 0,
    },
    work: {
      label: 'Alert or incident',
      kind: 'store',
      col: 5,
      row: 2,
    },
  },
  edges: [
    { from: 'raw', to: 'normalize' },
    { from: 'normalize', to: 'evaluate' },
    { from: 'ruleset', to: 'evaluate', kind: 'control' },
    { from: 'evaluate', to: 'detection' },
    { from: 'detection', to: 'log' },
    { from: 'log', to: 'evidence' },
    { from: 'log', to: 'work' },
  ],
  groups: [
    {
      label: 'analysis-engine',
      tone: 'backend',
      cols: [1, 3],
      rows: [1, 1],
    },
  ],
  legend: { process: 'Analysis step', control: 'Pinned ruleset' },
});
