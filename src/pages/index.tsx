import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import FeatureStatus from '@site/src/components/FeatureStatus';
import styles from './index.module.css';
const areas = [
  [
    '01',
    'Architecture',
    'Follow the data, the control plane, and the decisions that keep them separate.',
    '/docs/architecture/overview',
    'System boundaries →',
  ],
  [
    '02',
    'Seagull Agent',
    'Understand endpoint identity today and the path to durable collection and delivery.',
    '/docs/agent/overview',
    'Endpoint foundations →',
  ],
  [
    '03',
    'Detection & correlation',
    'Work with typed rules, event-time windows, evidence, and operator-owned incidents.',
    '/docs/detection/overview',
    'Detection lifecycle →',
  ],
  [
    '04',
    'Security',
    'Trace certificate trust, tenant authority, permissions, and their explicit limits.',
    '/docs/security/overview',
    'Trust boundaries →',
  ],
  [
    '05',
    'Operate the platform',
    'Bring up the development stack, inspect health, and diagnose failures by boundary.',
    '/docs/operations/overview',
    'Operator guides →',
  ],
  [
    '06',
    'Build with Seagull',
    'Navigate repository ownership, contracts, architecture tests, and contribution workflows.',
    '/docs/development/overview',
    'Developer guides →',
  ],
];
export default function Home() {
  return (
    <Layout
      title="Technical documentation"
      description="The engineering reference for Seagull V2: architecture, agent, security, detection, deployment, and operations."
    >
      <main className={styles.home}>
        <section className={styles.hero}>
          <div>
            <p className="eyebrow">SEAGULL / TECHNICAL DOCUMENTATION</p>
            <h1>
              Understand the platform.
              <br />
              <span>Follow every signal.</span>
            </h1>
            <p className={styles.lead}>
              The engineering guide to Seagull V2. From endpoint identity and
              durable telemetry to detection, investigation, and the systems
              behind them.
            </p>
            <div className={styles.actions}>
              <Link
                className="button button--primary"
                to="/docs/getting-started/quickstart"
              >
                Get started <span aria-hidden="true">→</span>
              </Link>
              <Link
                className="button button--secondary"
                to="/docs/architecture/overview"
              >
                Explore the architecture
              </Link>
            </div>
          </div>
          <aside className={styles.release}>
            <p className="eyebrow">V2 / DEVELOPMENT</p>
            <FeatureStatus status="in-progress" />
            <h2>Know what runs today.</h2>
            <p>
              Implementation and target architecture are documented separately,
              against pinned repository revisions.
            </p>
            <Link to="/docs/roadmap/status">View implementation status →</Link>
            <div className={styles.releaseMeta}>
              Source review · 20 September 2026
            </div>
          </aside>
        </section>
        <section className={styles.flowSection} aria-labelledby="flow-title">
          <div className={styles.sectionHeading}>
            <h2 id="flow-title">
              A durable backbone. Independent responsibilities.
            </h2>
            <Link to="/docs/architecture/event-lifecycle">
              Trace an event →
            </Link>
          </div>
          <ol className={styles.flow}>
            {[
              ['Endpoint agent', 'Collection & delivery · planned'],
              ['ingest-gateway', 'Verified identity · durable ACK'],
              ['Redpanda', 'Independent consumer groups'],
              ['Analysis & writers', 'Detection · analytical storage'],
            ].map(([title, detail]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{detail}</span>
              </li>
            ))}
          </ol>
          <p className={styles.flowCaption}>
            The control plane manages agents, certificates, rulesets, and
            triage. The query plane reads analytical evidence. The V2 frontend
            is planned.
          </p>
        </section>
        <section aria-labelledby="explore-title">
          <div className={styles.sectionHeading}>
            <h2 id="explore-title">Explore the documentation</h2>
            <span>Concepts → guides → reference</span>
          </div>
          <div className={styles.grid}>
            {areas.map(([number, title, description, to, action]) => (
              <Link className={styles.card} to={to} key={number}>
                <span className={styles.number}>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className={styles.cardAction}>{action}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className={styles.reference}>
          <div>
            <p className="eyebrow">KEEP THE DETAILS CLOSE</p>
            <h2>Go straight to the source of truth.</h2>
          </div>
          <div>
            <Link to="/docs/api/overview">API & protocols ↗</Link>
            <Link to="/docs/configuration/overview">Configuration ↗</Link>
            <Link to="/docs/contracts/overview">Wire contracts ↗</Link>
            <Link to="/docs/troubleshooting/overview">Troubleshooting ↗</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
