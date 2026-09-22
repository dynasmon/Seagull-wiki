import type { NodeKind } from '@site/src/components/FlowDiagram/layout';

export interface ParticipantSpec {
  readonly label: string;
  readonly detail?: string;
  readonly kind?: NodeKind;
  readonly planned?: boolean;
}

export interface MessageStep<Id extends string> {
  readonly from: Id;
  readonly to: Id;
  readonly label: string;
  readonly reply?: boolean;
}

export interface ActionStep<Id extends string> {
  readonly at: Id;
  readonly label: string;
}

export interface NoteStep<Id extends string> {
  readonly note: string;
  readonly over: Id | readonly [Id, Id];
}

export interface Branch<Id extends string> {
  readonly when: string;
  readonly steps: readonly SequenceStep<Id>[];
}

export interface AltStep<Id extends string> {
  readonly alt: readonly Branch<Id>[];
}

export type SequenceStep<Id extends string> =
  | MessageStep<Id>
  | ActionStep<Id>
  | NoteStep<Id>
  | AltStep<Id>;

export interface SequenceSpec<Id extends string = string> {
  readonly title: string;
  readonly caption?: string;
  readonly participants: Readonly<Record<Id, ParticipantSpec>>;
  readonly steps: readonly SequenceStep<NoInfer<Id>>[];
}

export function defineSequence<const Id extends string>(
  spec: SequenceSpec<Id>,
): SequenceSpec<Id> {
  return spec;
}

export type NumberedStep =
  | {
      readonly type: 'message';
      readonly n: number;
      readonly step: MessageStep<string>;
    }
  | {
      readonly type: 'action';
      readonly n: number;
      readonly step: ActionStep<string>;
    }
  | { readonly type: 'note'; readonly step: NoteStep<string> }
  | {
      readonly type: 'alt';
      readonly branches: readonly {
        readonly when: string;
        readonly steps: readonly NumberedStep[];
      }[];
    };

export function numberSteps(spec: SequenceSpec): readonly NumberedStep[] {
  const known = new Set(Object.keys(spec.participants));
  const fail = (message: string): never => {
    throw new Error(`Sequence "${spec.title}": ${message}`);
  };
  const check = (id: string) =>
    known.has(id) || fail(`unknown participant ${id}`);
  const walk = (
    steps: readonly SequenceStep<string>[],
    first: number,
  ): { steps: NumberedStep[]; next: number } => {
    let n = first;
    const numbered: NumberedStep[] = [];
    for (const step of steps) {
      if ('alt' in step) {
        if (step.alt.length === 0) fail('an alternative needs a branch');
        let next = n;
        const branches = step.alt.map((branch) => {
          const result = walk(branch.steps, n);
          next = Math.max(next, result.next);
          return { when: branch.when, steps: result.steps };
        });
        numbered.push({ type: 'alt', branches });
        n = next;
      } else if ('from' in step) {
        check(step.from);
        check(step.to);
        if (step.from === step.to)
          fail(`${step.label}: use an action for work inside one participant`);
        numbered.push({ type: 'message', n: n++, step });
      } else if ('at' in step) {
        check(step.at);
        numbered.push({ type: 'action', n: n++, step });
      } else {
        (typeof step.over === 'string' ? [step.over] : step.over).forEach(
          check,
        );
        numbered.push({ type: 'note', step });
      }
    }
    return { steps: numbered, next: n };
  };
  return walk(spec.steps, 1).steps;
}
