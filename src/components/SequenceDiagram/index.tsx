import React, { useMemo, type CSSProperties, type ReactNode } from 'react';
import clsx from 'clsx';
import DiagramLabel from '@site/src/components/DiagramLabel';
import { numberSteps, type NumberedStep, type SequenceSpec } from './model';
import styles from './styles.module.css';

type Style = CSSProperties & Record<`--${string}`, string | number>;

function StepNumber({ n }: { n: number }) {
  return <span className={styles.number}>{n}</span>;
}

export default function SequenceDiagram({
  diagram,
}: {
  diagram: SequenceSpec;
}) {
  const steps = useMemo(() => numberSteps(diagram), [diagram]);
  const ids = Object.keys(diagram.participants);
  const column = (id: string) => ids.indexOf(id);
  const name = (id: string) => diagram.participants[id].label;
  const span = (first: number, last: number, extra: Style = {}): Style => ({
    gridColumn: `${first + 1} / ${last + 2}`,
    ...extra,
  });
  const render = (items: readonly NumberedStep[]): ReactNode =>
    items.map((item, i) => {
      if (item.type === 'message') {
        const { from, to, label, reply } = item.step;
        const a = column(from);
        const b = column(to);
        return (
          <li
            key={i}
            className={clsx(
              styles.message,
              reply && styles.reply,
              Math.abs(b - a) > 1 && styles.crossing,
            )}
            data-direction={b > a ? 'right' : 'left'}
            style={span(Math.min(a, b), Math.max(a, b), {
              '--k': Math.abs(b - a) + 1,
            })}
          >
            <span className={styles.messageText}>
              <StepNumber n={item.n} />
              <span className="sg-visually-hidden">
                {name(from)} to {name(to)}:{' '}
              </span>
              {label}
            </span>
            <span className={styles.arrow} aria-hidden="true" />
          </li>
        );
      }
      if (item.type === 'action') {
        const at = column(item.step.at);
        return (
          <li key={i} className={styles.action} style={span(at, at)}>
            <span className={styles.actionBox}>
              <StepNumber n={item.n} />
              <span className="sg-visually-hidden">{name(item.step.at)}: </span>
              {item.step.label}
            </span>
          </li>
        );
      }
      if (item.type === 'note') {
        const over =
          typeof item.step.over === 'string'
            ? [item.step.over]
            : item.step.over;
        const columns = over.map(column);
        return (
          <li
            key={i}
            className={styles.note}
            style={span(Math.min(...columns), Math.max(...columns))}
          >
            <span className={styles.noteBox}>{item.step.note}</span>
          </li>
        );
      }
      return (
        <li key={i} className={styles.alt}>
          {item.branches.map((branch, j) => (
            <div key={j} className={styles.branch}>
              <p className={styles.when}>
                <span className={styles.keyword}>
                  {j === 0 ? 'if' : 'else'}
                </span>
                {branch.when}
              </p>
              <ol className={styles.nested}>{render(branch.steps)}</ol>
            </div>
          ))}
        </li>
      );
    });
  return (
    <figure
      className={clsx('sg-diagram', styles.figure)}
      data-diagram="sequence"
      style={{ '--n': ids.length } as Style}
    >
      <div className={styles.scroll}>
        <div className={styles.board}>
          <ul className={styles.participants} aria-label="Participants">
            {ids.map((id) => {
              const participant = diagram.participants[id];
              return (
                <li
                  key={id}
                  className={clsx(
                    styles.participant,
                    styles[participant.kind ?? 'process'],
                    participant.planned && styles.planned,
                  )}
                  data-participant={id}
                >
                  <DiagramLabel
                    text={participant.label}
                    className={styles.participantLabel}
                  />
                  {participant.detail && (
                    <span className={styles.participantDetail}>
                      {participant.detail}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <ol className={styles.steps} aria-label={diagram.title}>
            <li
              className={styles.lifelines}
              aria-hidden="true"
              role="presentation"
            >
              {ids.map((id) => (
                <span key={id} />
              ))}
            </li>
            {render(steps)}
          </ol>
        </div>
      </div>
      {diagram.caption && (
        <figcaption className="sg-diagram__caption">
          {diagram.caption}
        </figcaption>
      )}
    </figure>
  );
}
