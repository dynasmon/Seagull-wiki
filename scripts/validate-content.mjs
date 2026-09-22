import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
async function walk(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const files = (await walk('docs')).filter((f) => /\.mdx?$/.test(f));
for (const file of files) {
  const text = await readFile(file, 'utf8');
  if (!text.startsWith('---\n') || !/^description: .+/m.test(text))
    throw new Error(`${file}: missing page metadata`);
  if (/\b(TODO|TBD|lorem ipsum)\b/i.test(text))
    throw new Error(`${file}: unfinished content`);
  let fenced = false;
  const headings = new Set();
  for (const line of text.split('\n')) {
    if (/^```mermaid/.test(line))
      throw new Error(
        `${file}: Mermaid is not rendered; use FlowDiagram or SequenceDiagram`,
      );
    if (/^```/.test(line)) fenced = !fenced;
    if (!fenced && /^#{2,6} /.test(line)) {
      const heading = line.replace(/^#+ /, '').trim();
      if (headings.has(heading))
        throw new Error(`${file}: duplicate heading ${heading}`);
      headings.add(heading);
    }
  }
  if (fenced) throw new Error(`${file}: unclosed code fence`);
}
console.log(
  `Validated metadata, headings, and fences in ${files.length} documentation pages. Links, MDX, and diagram layouts are checked by the production build.`,
);
