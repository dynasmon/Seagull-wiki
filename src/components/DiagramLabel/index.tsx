import React, { Fragment } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const IDENTIFIER = /^[a-z0-9][a-z0-9._:/-]*$/;

export default function DiagramLabel({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  if (!IDENTIFIER.test(text)) return <span className={className}>{text}</span>;
  const parts = text.match(/[^./]*[./]?/g)?.filter(Boolean) ?? [text];
  return (
    <span className={clsx(className, styles.identifier)}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </span>
  );
}
