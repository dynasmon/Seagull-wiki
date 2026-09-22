import { readdir, readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
const base = process.env.DOCS_BASE_URL || '/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))
  throw new Error(
    'Base URL must be a slash-delimited path of letters, digits, underscores, or hyphens',
  );
const target = path.join('.static-site', base);
await mkdir(target, { recursive: true });
await cp('build', target, { recursive: true });
async function compress(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await compress(file);
    else if (/\.(?:html|css|js|json|svg|xml|txt)$/.test(file)) {
      const bytes = await readFile(file);
      if (bytes.length > 1024)
        await writeFile(file + '.gz', gzipSync(bytes, { level: 9 }));
    }
  }
}
await compress('.static-site');
const config = await readFile('docker/nginx.conf', 'utf8');
await writeFile('.nginx.conf', config.replaceAll('__BASE_URL__', base));
