import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const manifest = JSON.parse(
  await readFile(new URL('../sources/manifest.json', import.meta.url), 'utf8'),
);
const workspace = process.env.SEAGULL_WORKSPACE || path.resolve('..');
const changes = [];
for (const file of manifest.files) {
  const target = path.join(
    workspace,
    file.repository === 'workspace' ? '' : file.repository,
    file.path,
  );
  const bytes = await readFile(target).catch(() => null);
  if (
    !bytes ||
    createHash('sha256').update(bytes).digest('hex') !== file.sha256
  )
    changes.push(`${file.repository}/${file.path}`);
}
for (const repo of Object.keys(manifest.repositories)) {
  const tracked = execFileSync(
    'git',
    ['-C', path.join(workspace, repo), 'ls-files'],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  for (const file of tracked)
    if (!manifest.files.some((f) => f.repository === repo && f.path === file))
      changes.push(`${repo}/${file} (new)`);
}
if (changes.length) {
  console.error(
    'Source changes require a documentation review:\n' + changes.join('\n'),
  );
  process.exitCode = 1;
} else
  console.log(
    `All ${manifest.files.length} recorded source files match the reviewed workspace.`,
  );
