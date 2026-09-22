import React, {
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import clsx from 'clsx';
import DiagramLabel from '@site/src/components/DiagramLabel';
import {
  describeFlow,
  layoutFlow,
  type FlowEdgeKind,
  type FlowSpec,
  type LegendKey,
  type NodeKind,
} from './layout';
import styles from './styles.module.css';

const MIN_WIDTH = 560;
const LEGEND: Record<LegendKey, string> = {
  process: 'Process',
  topic: 'Redpanda topic',
  store: 'Data store',
  actor: 'External',
  planned: 'Planned',
  data: 'Data flow',
  control: 'Control flow',
  ack: 'Acknowledgement',
};
const NODE_ORDER: readonly NodeKind[] = ['actor', 'process', 'topic', 'store'];
const EDGE_ORDER: readonly FlowEdgeKind[] = ['data', 'control', 'ack'];

type Style = CSSProperties & Record<`--${string}`, string | number>;

const unit = (value: number) =>
  `calc(${Math.round(value * 100) / 100} * var(--u))`;

function Swatch({ entry }: { entry: LegendKey }) {
  if (entry === 'data' || entry === 'control' || entry === 'ack')
    return (
      <svg
        viewBox="0 0 28 14"
        aria-hidden="true"
        className={styles[`edge-${entry}`]}
      >
        <path d="M 2 7 H 19" className={styles.line} />
        <path d="M 18 3.5 L 26 7 L 18 10.5 Z" className={styles.arrow} />
      </svg>
    );
  const kind = entry === 'planned' ? 'process' : entry;
  const shape = {
    process:
      'M 5 1.5 H 23 Q 26.5 1.5 26.5 5 V 9 Q 26.5 12.5 23 12.5 H 5 Q 1.5 12.5 1.5 9 V 5 Q 1.5 1.5 5 1.5 Z',
    actor:
      'M 3 1.5 H 25 Q 26.5 1.5 26.5 3 V 11 Q 26.5 12.5 25 12.5 H 3 Q 1.5 12.5 1.5 11 V 3 Q 1.5 1.5 3 1.5 Z',
    topic: 'M 6 1.5 H 22 A 4.5 5.5 0 0 1 22 12.5 H 6 A 4.5 5.5 0 0 1 6 1.5 Z',
    store: 'M 6 3.5 A 8 2.25 0 0 1 22 3.5 V 10.5 A 8 2.25 0 0 1 6 10.5 Z',
  }[kind];
  const rim = {
    topic: 'M 6 1.5 A 4.5 5.5 0 0 1 6 12.5',
    store: 'M 6 3.5 A 8 2.25 0 0 0 22 3.5',
  }[kind as 'topic' | 'store'];
  return (
    <svg
      viewBox="0 0 28 14"
      aria-hidden="true"
      className={clsx(
        styles.shape,
        styles[kind],
        entry === 'planned' && styles.planned,
      )}
    >
      <path d={shape} />
      {rim && <path d={rim} className={styles.rim} />}
    </svg>
  );
}

export default function FlowDiagram({ diagram }: { diagram: FlowSpec }) {
  const layout = useMemo(() => layoutFlow(diagram), [diagram]);
  const description = useMemo(() => describeFlow(diagram), [diagram]);
  const [focus, setFocus] = useState<string | null>(null);
  const descriptionId = `${useId().replace(/[^\w-]/g, '')}-description`;
  const neighbours = useMemo(() => {
    const related = new Set<string>();
    if (focus === null) return related;
    related.add(focus);
    for (const edge of layout.edges)
      if (edge.from === focus || edge.to === focus) {
        related.add(edge.from);
        related.add(edge.to);
      }
    return related;
  }, [focus, layout]);
  const legend = [
    ...NODE_ORDER.filter((kind) =>
      layout.nodes.some((node) => node.spec.kind === kind),
    ),
    ...(layout.nodes.some((node) => node.spec.planned)
      ? (['planned'] as const)
      : []),
    ...EDGE_ORDER.filter((kind) =>
      layout.edges.some((edge) => edge.kind === kind),
    ),
  ];
  const relatedEdge = (edge: { from: string; to: string }) =>
    focus !== null && (edge.from === focus || edge.to === focus)
      ? ''
      : undefined;
  const pointer = (id: string | null) => (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setFocus(id);
  };
  const tap = (id: string) => (event: PointerEvent) => {
    if (event.pointerType !== 'mouse')
      setFocus((current) => (current === id ? null : id));
  };
  const frame: Style = {
    maxWidth: `${layout.width}px`,
    minWidth: `${Math.min(layout.width, MIN_WIDTH)}px`,
  };
  const canvas: Style = {
    '--w': layout.width,
    aspectRatio: `${layout.width} / ${layout.height}`,
  };
  return (
    <figure className={clsx('sg-diagram', styles.figure)} data-diagram="flow">
      <div className={styles.scroll}>
        <div className={styles.frame} style={frame}>
          <div
            className={styles.canvas}
            style={canvas}
            role="img"
            aria-label={diagram.title}
            aria-describedby={descriptionId}
            data-focus={focus === null ? undefined : ''}
          >
            <svg
              className={styles.svg}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
              focusable="false"
            >
              {layout.groups.map((group, i) => (
                <rect
                  key={i}
                  className={styles.group}
                  data-tone={group.spec.tone ?? 'neutral'}
                  x={group.x}
                  y={group.y}
                  width={group.width}
                  height={group.height}
                  rx={10}
                />
              ))}
              {layout.edges.map((edge, i) => (
                <g
                  key={i}
                  className={clsx(styles.edge, styles[`edge-${edge.kind}`])}
                  data-related={relatedEdge(edge)}
                >
                  <path d={edge.path} className={styles.line} />
                  <path d={edge.arrow} className={styles.arrow} />
                </g>
              ))}
              {layout.nodes.map((node) => (
                <g
                  key={node.id}
                  className={clsx(
                    styles.shape,
                    styles[node.spec.kind],
                    node.spec.planned && styles.planned,
                  )}
                  data-related={neighbours.has(node.id) ? '' : undefined}
                >
                  <path d={node.shape} />
                  {node.rim && <path d={node.rim} className={styles.rim} />}
                </g>
              ))}
            </svg>
            {layout.groups.map((group, i) => {
              const [vertical, horizontal] = (
                group.spec.labelPosition ?? 'top-left'
              ).split('-');
              return (
                <span
                  key={i}
                  className={styles.groupLabel}
                  data-tone={group.spec.tone ?? 'neutral'}
                  style={{
                    [horizontal]: unit(
                      horizontal === 'left'
                        ? group.x + 12
                        : layout.width - group.x - group.width + 12,
                    ),
                    [vertical]: unit(
                      vertical === 'top'
                        ? group.y + 9
                        : layout.height - group.y - group.height + 8,
                    ),
                  }}
                >
                  {group.spec.label}
                </span>
              );
            })}
            {layout.nodes.map((node) => (
              <div
                key={node.id}
                className={clsx(
                  styles.node,
                  styles[`node-${node.spec.kind}`],
                  node.spec.planned && styles.planned,
                )}
                data-node={node.id}
                data-related={neighbours.has(node.id) ? '' : undefined}
                style={{
                  left: unit(node.x + node.inset.left),
                  top: unit(node.y + node.inset.top),
                  width: unit(node.width - node.inset.left - node.inset.right),
                  height: unit(
                    node.height - node.inset.top - node.inset.bottom,
                  ),
                }}
                onPointerEnter={pointer(node.id)}
                onPointerLeave={pointer(null)}
                onPointerUp={tap(node.id)}
              >
                <DiagramLabel
                  text={node.spec.label}
                  className={styles.nodeLabel}
                />
                {node.spec.detail && (
                  <span className={styles.nodeDetail}>{node.spec.detail}</span>
                )}
              </div>
            ))}
            {layout.edges.map(
              (edge, i) =>
                edge.label && (
                  <span
                    key={i}
                    className={styles.edgeLabel}
                    data-side={edge.label.side}
                    data-related={relatedEdge(edge)}
                    style={{
                      left: unit(edge.label.x),
                      top: unit(edge.label.y),
                    }}
                  >
                    {edge.label.text}
                  </span>
                ),
            )}
          </div>
        </div>
      </div>
      <p id={descriptionId} className="sg-visually-hidden">
        {description}
      </p>
      <ul className={styles.legend} aria-label="Legend">
        {legend.map((entry) => (
          <li key={entry}>
            <Swatch entry={entry} />
            {diagram.legend?.[entry] ?? LEGEND[entry]}
          </li>
        ))}
        <li className={styles.hint} aria-hidden="true">
          Hover or tap a box to highlight its connections
        </li>
      </ul>
      {diagram.caption && (
        <figcaption className="sg-diagram__caption">
          {diagram.caption}
        </figcaption>
      )}
    </figure>
  );
}
