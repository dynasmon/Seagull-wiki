import React from 'react';
import { EuiBadge } from '@elastic/eui';
const states = {
  implemented: { label: 'Implemented', color: 'success' },
  'in-progress': { label: 'In progress', color: 'warning' },
  planned: { label: 'Planned', color: 'hollow' },
  target: { label: 'Target architecture', color: 'hollow' },
  experimental: { label: 'Experimental', color: 'warning' },
  deprecated: { label: 'Deprecated', color: 'danger' },
} as const;
export type FeatureState = keyof typeof states;
export default function FeatureStatus({ status }: { status: FeatureState }) {
  const state = states[status];
  return (
    <span className="feature-status">
      <EuiBadge color={state.color}>{state.label}</EuiBadge>
    </span>
  );
}
