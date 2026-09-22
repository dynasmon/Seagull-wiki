import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = new URL('../', import.meta.url).pathname;
const manifest = JSON.parse(
  await readFile(path.join(root, 'sources/manifest.json'), 'utf8'),
);
const check = process.argv.includes('--check');
const backend = 'Seagull-backend-v2';
const contracts = 'Seagull-contracts';
const read = (repo, file) =>
  readFile(path.join(root, 'sources', repo, file), 'utf8');
const link = (repo, file) =>
  manifest.files.some(
    (f) => f.repository === repo && f.path === file && f.local,
  )
    ? '/docs/reference/source-baseline#local-planning-evidence'
    : `${manifest.repositories[repo].url}/blob/${manifest.repositories[repo].revision}/${file}`;
const header = (title, description) =>
  `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n`;
async function emit(file, text) {
  const target = path.join(root, file);
  if (check) {
    if ((await readFile(target, 'utf8').catch(() => '')) !== text)
      throw new Error(
        `Generated reference is stale: ${file}. Run npm run references.`,
      );
  } else {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, text);
  }
}
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) =>
          e.isDirectory()
            ? walk(path.join(dir, e.name))
            : path.join(dir, e.name),
        ),
    )
  ).flat();
}
const provenance = (repo, file) =>
  `\n## Source evidence\n\nGenerated from [\`${file}\`](${link(repo, file)}) at \`${manifest.repositories[repo].revision.slice(0, 7)}\`. Refresh the checked-in snapshot before regenerating; a normal build does not access another repository.\n`;
for (const file of (
  await walk(path.join(root, 'sources', contracts, 'proto'))
).filter((f) => f.endsWith('.proto'))) {
  const relative = path.relative(path.join(root, 'sources', contracts), file);
  const text = await readFile(file, 'utf8');
  const name = relative.split('/')[2];
  const packageName = text.match(/package ([^;]+);/)[1];
  const messages = [...text.matchAll(/^(message|enum) (\w+) \{/gm)];
  let page = header(
    `${name[0].toUpperCase() + name.slice(1)} contract`,
    `Canonical ${packageName} messages and field definitions.`,
  );
  page += `This is the pinned \`${packageName}\` wire definition. A declared message describes a protocol shape; it does not prove that every producer or consumer is implemented. See [contract compatibility](/docs/contracts/compatibility) and [implementation status](/docs/roadmap/status).\n\n`;
  for (let i = 0; i < messages.length; i++) {
    const match = messages[i];
    let end = match.index + match[0].length,
      depth = 1;
    while (end < text.length && depth) {
      if (text[end] === '{') depth++;
      if (text[end] === '}') depth--;
      end++;
    }
    const block = text.slice(match.index, end);
    page += `## ${match[2]}\n\n\`\`\`protobuf\n${block}\n\`\`\`\n\n`;
  }
  page += provenance(contracts, relative);
  await emit(`docs/reference/generated/contracts/${name}.md`, page);
  await emit(`static/reference/${name}.proto`, text);
}
const configFiles = (await walk(path.join(root, 'sources', backend))).filter(
  (f) => f.endsWith('.go'),
);
const groups = new Map();
for (const file of configFiles) {
  const text = await readFile(file, 'utf8');
  const relative = path.relative(path.join(root, 'sources', backend), file);
  const scope = relative.startsWith('cmd/') ? relative.split('/')[1] : 'shared';
  for (const match of text.matchAll(
    /(?:parser|p)\.(\w+)\(\s*"(SEAGULL_[A-Z0-9_]+)"/g,
  )) {
    let end = match.index + match[0].length,
      depth = 1,
      quoted = false;
    for (; end < text.length && depth; end++) {
      const c = text[end];
      if (c === '"' && text[end - 1] !== '\\') quoted = !quoted;
      if (!quoted) {
        if (c === '(') depth++;
        if (c === ')') depth--;
      }
    }
    const expression = text.slice(match.index, end).replace(/\s+/g, ' ');
    const rows = groups.get(scope) || new Map();
    rows.set(match[2], { type: match[1], expression, relative });
    groups.set(scope, rows);
  }
}
let configIndex = header(
  'Environment variable index',
  'Complete source-derived environment variable declarations grouped by process.',
);
configIndex +=
  'The declarations below are extracted from the typed configuration calls, including shared broker, store, and process settings. Arguments preserve their Go notation so defaults and limits are not guessed. `Duration(name, default, minimum, maximum)`, `Int`, and `Bytes` carry bounds. `Required*` has no default; `Enum` lists its default first. `Secret` has no public default. A service-name constant denotes the executable name. The explanatory [configuration guide](/docs/configuration/overview) describes file-based values and deployment overrides.\n\n';
for (const [scope, rows] of [...groups].sort()) {
  const sorted = [...rows].sort();
  configIndex += `- [${scope}](./environment/${scope}.md) — ${rows.size} declarations.\n`;
  let page = header(
    `${scope} environment`,
    `Typed environment declarations for ${scope}, including defaults and validation bounds.`,
  );
  page +=
    'Generated from configuration code. Values shown as expressions are Go constants, not shell input. [Read the declaration notation](../environment.md). All processes also use [shared settings](./shared.md). Secret values are never included.\n\n';
  for (const [name, entry] of sorted)
    page += `## ${name}\n\n**Type:** ${entry.type}. [Declaration](${link(backend, entry.relative)}).\n\n\`\`\`go\n${entry.expression}\n\`\`\`\n\n`;
  await emit(`docs/reference/generated/environment/${scope}.md`, page);
}
await emit('docs/reference/generated/environment.md', configIndex);
const controlFiles = configFiles.filter((f) =>
  f.includes('/internal/control/'),
);
const control = (
  await Promise.all(controlFiles.map((f) => readFile(f, 'utf8')))
).join('\n');
const constants = Object.fromEntries(
  [...control.matchAll(/(\w+)\s*=\s*"(\/v1\/[^"\n]+)"/g)].map((m) => [
    m[1],
    m[2],
  ]),
);
let api = header(
  'HTTP route reference',
  'HTTP methods, paths, and declared permissions extracted from backend route registration.',
);
api +=
  'The current APIs carry binary Protocol Buffers over HTTPS. This is generated from route registrations, not an OpenAPI document: none is present in the inspected repository. See [API conventions](/docs/api/overview) for authentication, payload types, errors, and pagination.\n\n## Control API\n\n| Method | Path | Route | Requirement |\n|---|---|---|---|\n';
for (const m of control.matchAll(
  /\{http\.Method(\w+),\s*(\w+),\s*"([^"]+)",\s*((?:Permits\([^)]*\)|Certificate\(\)|Session\(\)))/g,
)) {
  if (!constants[m[2]]) throw new Error(`Unresolved route: ${m[2]}`);
  api += `| ${m[1].toUpperCase()} | \`${constants[m[2]]}\` | \`${m[3]}\` | \`${m[4]}\` |\n`;
}
api +=
  '\n`Permits` requires a certificate-bound session and the named policy permission. `Certificate()` permits the authenticated bootstrap surfaces; `Session()` requires a live session. Tenant checks are also enforced in handlers.\n\n## Agent and query surfaces\n\n| Listener | Method | Path | Payload |\n|---|---|---|---|\n';
api +=
  '| Ingest | POST | `/v1/events` | `ingest.v1.EventBatch` → `BatchAck` |\n| Ingest | POST | `/v1/inventory` | `inventory.v1.RecordBatch` → `ingest.v1.BatchAck` |\n| Query | POST | `/v1/hunt/events` | `hunt.v1.Query` → `EventPage` |\n| Query | POST | `/v1/hunt/detections` | `hunt.v1.Query` → `DetectionPage` |\n';
const renewal = control.match(/RenewalPath\s*=\s*"([^"]+)"/);
if (renewal)
  api += `| Agent renewal | POST | \`${renewal[1]}\` | Agent-authenticated certificate renewal |\n`;
api +=
  '\nQuery scope is derived from certificate organizations, not the control session policy. The renewal listener accepts agent certificates; operator routes accept caller certificates. These trust domains are not interchangeable.\n';
api += provenance(backend, 'internal/control/server.go');
await emit('docs/reference/generated/http-routes.md', api);
for (const file of (
  await walk(path.join(root, 'sources', backend, 'docs/decisions'))
).filter((f) => /\/\d{4}.*\.md$/.test(f))) {
  const content = await readFile(file, 'utf8');
  const name = path.basename(file);
  const title = content.split('\n')[0].replace(/^# /, '');
  const text =
    header(
      title,
      `Architecture decision record ${name.slice(0, 4)} from the Seagull backend.`,
    ) +
    ':::info Historical decision record\nThis decision is reproduced from the pinned backend revision. Read amendment notices and the [current architecture](/docs/architecture/overview) before treating historical statements as current behavior.\n:::\n\n' +
    content.replace(/^# .*\n/, '') +
    provenance(backend, `docs/decisions/${name}`);
  await emit(`docs/architecture/decisions/${name}`, text);
}

const prose = [
  ['operational', 'Backend operational reference', 'docs/configuration.md'],
  [
    'performance',
    'Historical ingest performance baseline',
    'notes/performance-baseline.md',
  ],
];
for (const [slug, title, file] of prose) {
  let content = (await read(backend, file)).replace(/^# .*\n/, '');
  content = content.replace(/\]\((?!https?:|#)([^)]+)\)/g, (_, target) => {
    if (target.startsWith('decisions'))
      return `](/docs/architecture/decisions/${target
        .replace(/^decisions\/?/, '')
        .replace(/\.md$/, '')
        .replace(/^\d+-/, '')})`;
    return `](${link(backend, path.posix.normalize(path.posix.join(path.posix.dirname(file), target)))})`;
  });
  await emit(
    `docs/reference/generated/${slug}.md`,
    header(title, `${title} reproduced from the reviewed backend source.`) +
      ':::info Source snapshot\nThis is the maintainer reference at the reviewed baseline. Historical measurements are not production guarantees. Current source declarations take precedence over prose; see [configuration](/docs/configuration/overview).\n:::\n\n' +
      content +
      provenance(backend, file),
  );
}
const ruleFile = 'deploy/rules/authentication.yml';
await emit(
  'docs/reference/generated/rules.md',
  header(
    'Shipped authentication rules',
    'Complete unmodified rule examples and their executable cases.',
  ) +
    'These are the three shipped backend development rules, including known false positives and their test cases. Read [rule authoring](/docs/detection/rules) before adapting them.\n\n```yaml\n' +
    (await read(backend, ruleFile)) +
    '\n```\n' +
    provenance(backend, ruleFile),
);
let storage = header(
  'Storage migration reference',
  'Canonical SQL migrations for analytical and transactional persistence.',
);
storage +=
  'Migrations are shown in order within their owning store. Later alterations amend earlier table definitions. See [migration ownership](/docs/storage/migrations) before applying changes. This reference is not a manual execution script.\n\n';
for (const adapter of ['clickhouse', 'postgres']) {
  for (const file of (
    await walk(
      path.join(root, 'sources', backend, 'internal', adapter, 'schema'),
    )
  ).filter((f) => f.endsWith('.sql'))) {
    const relative = path.relative(path.join(root, 'sources', backend), file);
    storage += `## ${adapter}: ${path.basename(file)}\n\n[Canonical source](${link(backend, relative)})\n\n\`\`\`sql\n${await readFile(file, 'utf8')}\n\`\`\`\n\n`;
  }
}
await emit('docs/reference/generated/storage.md', storage);
let metrics = header(
  'Metric declarations',
  'Source-derived metric names, subsystems, and help text for backend operational signals.',
);
metrics +=
  'These declarations are extracted from registered metric option blocks. Full names combine the registry namespace (`seagull`), subsystem, and name; histogram exposition also includes bucket/sum/count series. Check the live `/metrics` response for the signals registered by a specific executable. See [observability](/docs/observability/health).\n\n';
for (const file of (await walk(path.join(root, 'sources', backend))).filter(
  (f) => f.endsWith('/metrics.go'),
)) {
  const content = await readFile(file, 'utf8');
  const entries = [
    ...content.matchAll(
      /Subsystem:\s*"([^"\n]+)",\s*Name:\s*"([^"\n]+)",\s*Help:\s*"([^"\n]+)"/g,
    ),
  ];
  if (!entries.length) continue;
  const relative = path.relative(path.join(root, 'sources', backend), file);
  metrics += `## ${relative.replace('/metrics.go', '')}\n\n[Definitions](${link(backend, relative)})\n\n| Name | Meaning |\n|---|---|\n`;
  for (const m of entries)
    metrics += `| \`seagull_${m[1]}_${m[2]}\` | ${m[3].replaceAll('|', '\\|')} |\n`;
  metrics += '\n';
}
await emit('docs/reference/generated/metrics.md', metrics);
console.log(
  check
    ? 'Generated references match their source snapshots.'
    : 'Generated schema, configuration, route, and decision references.',
);
