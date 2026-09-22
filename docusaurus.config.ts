import type { Config } from '@docusaurus/types';
import type { Options, ThemeConfig } from '@docusaurus/preset-classic';
import { themes } from 'prism-react-renderer';
const baseUrl = process.env.DOCS_BASE_URL || '/';
if (!baseUrl.startsWith('/') || !baseUrl.endsWith('/'))
  throw new Error('DOCS_BASE_URL must start and end with /');
if (baseUrl === '/docs/')
  throw new Error(
    'DOCS_BASE_URL must not equal the docs route base: Docusaurus leaves a site link that already starts with the base URL unprefixed, which breaks every /docs/ link. Use a different prefix, such as /wiki/.',
  );
const config: Config = {
  title: 'Seagull',
  tagline: 'Understand, operate, and build the security platform.',
  url: process.env.DOCS_URL || 'https://docs.example.com',
  baseUrl,
  organizationName: 'dynasmon',
  projectName: 'Seagull-wiki',
  favicon: 'img/seagull.svg',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: {
    format: 'detect',
    hooks: { onBrokenMarkdownLinks: 'throw', onBrokenMarkdownImages: 'throw' },
  },
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
          versions: { current: { label: 'V2 · development' } },
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
        sitemap: { changefreq: 'weekly', priority: 0.5 },
      } satisfies Options,
    ],
  ],
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        indexPages: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
  themeConfig: {
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
    navbar: {
      title: 'Seagull',
      logo: { alt: '', src: 'img/seagull.svg', width: 30, height: 30 },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          label: 'Documentation',
          position: 'left',
        },
        {
          to: '/docs/architecture/overview',
          label: 'Architecture',
          position: 'left',
        },
        { to: '/docs/agent/overview', label: 'Agent', position: 'left' },
        { to: '/docs/api/overview', label: 'API', position: 'left' },
        {
          href: 'https://github.com/dynasmon/Seagull-backend-v2',
          label: 'GitHub',
          position: 'right',
        },
        { type: 'search', position: 'right' },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          label: 'Seagull V2 documentation',
          to: '/docs/introduction/overview',
        },
        { label: 'Security model', to: '/docs/security/overview' },
        { label: 'Contribute', to: '/docs/contributing/guide' },
        {
          label: 'Source & license',
          href: 'https://github.com/dynasmon/Seagull-backend-v2/blob/main/LICENSE',
        },
      ],
      copyright:
        'Built from versioned source evidence. V2 is under active development.',
    },
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: [
        'bash',
        'json',
        'yaml',
        'go',
        'python',
        'typescript',
        'docker',
        'protobuf',
        'sql',
        'nginx',
      ],
    },
    metadata: [
      { name: 'theme-color', content: '#0f172a' },
      { property: 'og:type', content: 'website' },
    ],
  } satisfies ThemeConfig,
};
export default config;
