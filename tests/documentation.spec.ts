import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const prefix = (process.env.DOCS_TEST_BASE_PATH || '/').replace(/\/$/, '');
const route = (value: string) => `${prefix}${value}`;
const docsDir = join(__dirname, '..', 'docs');
const diagramPages = readdirSync(docsDir, { recursive: true, encoding: 'utf8' })
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => ({
    path: `/docs/${file.replace(/\.mdx?$/, '')}/`,
    diagrams:
      readFileSync(join(docsDir, file), 'utf8')
        .replace(/^```[^]*?^```$/gm, '')
        .match(/^<(Flow|Sequence)Diagram\b/gm)?.length ?? 0,
  }))
  .filter(({ diagrams }) => diagrams > 0);
const widerText =
  '.sg-diagram *:not([class*="identifier"]) { letter-spacing: 0.04em !important; }';
const diagramMisfits = () => {
  const problems: string[] = [];
  const rect = (element: Element) => element.getBoundingClientRect();
  const within = (outer: DOMRect, inner: DOMRect) =>
    inner.left >= outer.left - 1 &&
    inner.right <= outer.right + 1 &&
    inner.top >= outer.top - 1 &&
    inner.bottom <= outer.bottom + 1;
  const overlaps = (a: DOMRect, b: DOMRect) =>
    a.left < b.right &&
    b.left < a.right &&
    a.top < b.bottom &&
    b.top < a.bottom;
  const all = (selector: string, root: ParentNode = document) =>
    Array.from(root.querySelectorAll<HTMLElement>(selector));
  const nodes = all('[data-node]');
  for (const node of nodes)
    for (const text of Array.from(node.children)) {
      const range = document.createRange();
      range.selectNodeContents(text);
      if (!within(rect(node), range.getBoundingClientRect()))
        problems.push(`${node.dataset.node} overflows: ${text.textContent}`);
    }
  for (const label of all('.sg-diagram [data-side]'))
    for (const node of nodes)
      if (overlaps(rect(label), rect(node)))
        problems.push(`${label.textContent} covers ${node.dataset.node}`);
  for (const figure of all('[data-diagram="sequence"]')) {
    const lifelines = all('[data-participant]', figure).map(
      (participant) => rect(participant).left + rect(participant).width / 2,
    );
    for (const arrow of all('[data-direction] > [aria-hidden="true"]', figure))
      for (const end of [rect(arrow).left, rect(arrow).right])
        if (!lifelines.some((x) => Math.abs(x - end) <= 2))
          problems.push(
            `arrow misses a lifeline: ${arrow.parentElement?.textContent}`,
          );
  }
  return problems;
};
const samples = [
  ['/', 'Understand the platform.'],
  ['/docs/architecture/overview/', 'System architecture'],
  ['/docs/agent/configuration/', 'Agent configuration'],
  ['/docs/security/threat-model/', 'Threat model'],
  ['/docs/reference/generated/http-routes/', 'HTTP route reference'],
  ['/docs/reference/generated/contracts/event/', 'Event contract'],
  ['/docs/getting-started/quickstart/', 'Run the development platform'],
];
test('representative routes render without browser exceptions or viewport overflow', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const [path, title] of samples) {
    const response = await page.goto(route(path));
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(title);
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme',
      testInfo.project.name.endsWith('dark') ? 'dark' : 'light',
    );
    if (path.includes('/architecture/'))
      await expect(page.locator('figure.sg-diagram').first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    expect(overflow, path).toBe(false);
    await page.screenshot({
      path: testInfo.outputPath(
        path === '/'
          ? 'home.png'
          : `${path.split('/').filter(Boolean).pop()}.png`,
      ),
      fullPage: false,
    });
  }
  expect(errors).toEqual([]);
});
for (const { path, diagrams } of diagramPages)
  test(`diagrams on ${path} keep their text inside, even when it is wider`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route(path));
    await expect(page.locator('figure.sg-diagram')).toHaveCount(diagrams);
    expect(await page.evaluate(diagramMisfits)).toEqual([]);
    await page.addStyleTag({ content: widerText });
    expect(await page.evaluate(diagramMisfits)).toEqual([]);
    expect(errors).toEqual([]);
  });

test('hovering a diagram box highlights only its connections', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover needs a mouse; touch uses tap');
  await page.goto(route('/docs/architecture/overview/'));
  const canvas = page.locator('figure.sg-diagram [role="img"]').first();
  await page.locator('[data-node="analysis"]').hover();
  await expect(canvas).toHaveAttribute('data-focus', '');
  await expect(page.locator('[data-node][data-related]')).toHaveCount(4);
  await page.mouse.move(0, 0);
  await expect(canvas).not.toHaveAttribute('data-focus');
});
test('local search finds a technical concept and opens its result', async ({
  page,
}) => {
  await page.goto(route('/'));
  const search = page.locator('input[aria-label="Search"]').first();
  await search.click();
  await search.fill('durable');
  await expect(page.getByRole('option').first()).toBeVisible();
  await search.press('ArrowDown');
  await search.press('Enter');
  await expect(page).toHaveURL(/\/docs\//);
  await expect(page.locator('article')).toBeVisible();
});

test('color mode cycles between system, light, and dark, and persists the choice', async ({
  page,
  isMobile,
}, testInfo) => {
  const systemTheme = testInfo.project.name.endsWith('dark') ? 'dark' : 'light';
  const html = page.locator('html');
  const colorToggle = page.getByRole('button', {
    name: /Switch between dark and light mode/,
  });
  const cycle = async () => {
    if (isMobile && (await colorToggle.filter({ visible: true }).count()) === 0)
      await page.getByRole('button', { name: 'Toggle navigation bar' }).click();
    await colorToggle.filter({ visible: true }).first().click();
  };

  await page.goto(route('/docs/introduction/overview/'));
  await expect(html).toHaveAttribute('data-theme-choice', 'system');
  await expect(html).toHaveAttribute('data-theme', systemTheme);

  await cycle();
  await expect(html).toHaveAttribute('data-theme-choice', 'light');
  await expect(html).toHaveAttribute('data-theme', 'light');

  await cycle();
  await expect(html).toHaveAttribute('data-theme-choice', 'dark');
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme-choice', 'dark');
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await cycle();
  await expect(html).toHaveAttribute('data-theme-choice', 'system');
  await expect(html).toHaveAttribute('data-theme', systemTheme);
});

test('unknown path has real 404 response with useful recovery', async ({
  page,
}) => {
  const response = await page.goto(route('/missing-seagull-document/'));
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Find your way back.');
  await expect(
    page.getByRole('link', { name: 'Open documentation' }),
  ).toBeVisible();
  await expect(page.locator('input[aria-label="Search"]').last()).toBeVisible();
});
