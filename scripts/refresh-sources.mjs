import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = new URL('../', import.meta.url).pathname;
const workspace = process.env.SEAGULL_WORKSPACE || path.resolve(root, '..');
const manifest = { reviewed: '2026-09-20', repositories: {}, files: [] };
const repos = [
  'Seagull-backend-v2',
  'Seagull-agent-v2',
  'Seagull-contracts',
  'Seagull-frontend-v2',
];
for (const name of repos) {
  const repo = path.join(workspace, name);
  const git = (args) =>
    execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();
  const tracked = git(['ls-files']).split('\n').filter(Boolean);
  const revision = git(['rev-parse', 'HEAD']);
  manifest.repositories[name] = {
    revision,
    url: `https://github.com/dynasmon/${name}`,
    trackedFiles: tracked.length,
  };
  for (const file of tracked) {
    const bytes = await readFile(path.join(repo, file));
    manifest.files.push({
      repository: name,
      path: file,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
    const selected =
      [
        'README.md',
        'Makefile',
        'go.mod',
        '.github/workflows/ci.yml',
        'docs/configuration.md',
        'deploy/compose.yaml',
        'deploy/compose.test.yaml',
        'deploy/rules/authentication.yml',
        'deploy/alerting.yml',
        'deploy/policy.yml',
      ].includes(file) ||
      file.startsWith('docs/decisions/') ||
      file.endsWith('.proto') ||
      file.endsWith('.sql') ||
      (file.endsWith('.go') &&
        !file.endsWith('_test.go') &&
        (file.startsWith('cmd/') ||
          /^internal\/(control|hunt|platform\/config|platform\/service|backbone|broker|clickhouse|postgres)\//.test(
            file,
          ) ||
          file.endsWith('/metrics.go')));
    if (selected) {
      const target = path.join(root, 'sources', name, file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, bytes);
    }
  }
  if (name === 'Seagull-backend-v2') {
    for (const entry of await readdir(path.join(repo, 'notes'))) {
      if (!entry.endsWith('.md')) continue;
      const file = `notes/${entry}`,
        bytes = await readFile(path.join(repo, file));
      manifest.files.push({
        repository: name,
        path: file,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        local: true,
      });
      const target = path.join(root, 'sources', name, file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, bytes);
    }
  }
}
for (const file of ['AGENTS-BACKLOG.md', 'AGENTS.md']) {
  const bytes = await readFile(path.join(workspace, file));
  manifest.files.push({
    repository: 'workspace',
    path: file,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    local: true,
  });
  const target = path.join(root, 'sources/workspace', file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
}
await writeFile(
  path.join(root, 'sources/manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(
  'Source inputs refreshed. Review changed evidence, set the reviewed date after the audit, update authored guides, then regenerate references.',
);
