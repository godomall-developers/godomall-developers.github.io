import {themes as prismThemes} from 'prism-react-renderer';
import fs from 'fs';
import path from 'path';

// ─── MD 파일에서 그룹(### 헤딩 + 항목) 파싱 ───────────────────────────────────
function parseGroups(content) {
  const groups = [];
  let cur = null;
  for (const line of content.split('\n')) {
    const h3 = line.match(/^###\s+(.+)/);
    if (h3) {
      if (cur) groups.push(cur);
      cur = { type: h3[1].trim(), items: [] };
    } else if (line.startsWith('- ') && cur) {
      cur.items.push(line.slice(2).trim());
    }
  }
  if (cur) groups.push(cur);
  return groups;
}

// ─── 릴리즈노트 MD 자동 수집 플러그인 ─────────────────────────────────────────
async function releaseNotesDataPlugin(context) {
  return {
    name: 'release-notes-data',
    async loadContent() {
      const versions = ['godo25', 'godo26'];
      const data = {};
      for (const version of versions) {
        const dir = path.join(context.siteDir, 'docs', `release-notes-${version}`);
        if (!fs.existsSync(dir)) { data[version] = []; continue; }
        const files = fs.readdirSync(dir)
          .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
          .sort()
          .reverse(); // 최신순
        data[version] = files.map(file => {
          const date = file.replace('.md', '');
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          const diffFile = path.join(context.siteDir, 'docs', `source-diff-${version}`, `${date}.md`);
          return {
            date,
            diffPath: fs.existsSync(diffFile) ? `/source-diff-${version}/${date}` : null,
            groups: parseGroups(content),
          };
        });
      }
      return data;
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}

// 날짜 파일명(YYYY-MM-DD*.md) 문서들을 최신순(내림차순)으로 정렬.
// index.md 같은 카테고리 대표 문서는 맨 위에 유지.
const reverseChronologicalSidebar = async ({defaultSidebarItemsGenerator, ...args}) => {
  const items = await defaultSidebarItemsGenerator(args);
  const isDateDoc = (item) => {
    if (item.type !== 'doc') return false;
    const id = (item.id || '').split('/').pop() || '';
    return /^\d{4}-\d{2}-\d{2}/.test(id);
  };
  // 날짜 doc은 파일명에서 날짜를 뽑아 사이드바 라벨로 강제 (frontmatter 없어도 동작)
  const dateDocs = items.filter(isDateDoc).map((item) => {
    const id = (item.id || '').split('/').pop() || '';
    const dateMatch = id.match(/^(\d{4}-\d{2}-\d{2})/);
    return dateMatch ? {...item, label: dateMatch[1]} : item;
  }).reverse();
  const others = items.filter((item) => !isDateDoc(item));
  return [...others, ...dateDocs];
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '고도몰 개발자 센터',
  tagline: 'Godomall Developer Center',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  stylesheets: [
    // CommerceSans @font-face 는 main.min.css 안에 포함되어 있음 (별도 URL 404)
    'https://fe-sdk.cdn-nhncommerce.com/@ncds/ui-admin/1.8/main.min.css',
  ],
  scripts: [
    {
      src: 'https://fe-sdk.cdn-nhncommerce.com/@ncds/ui-admin/1.8/main.min.js',
      async: true,
    },
  ],

  url: 'https://godomall-developers.github.io',
  baseUrl: '/',

  organizationName: 'godomall-developers',
  projectName: 'godomall-developers.github.io',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  plugins: [
    releaseNotesDataPlugin,
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'source-diff-godo25',
        path: 'docs/source-diff-godo25',
        routeBasePath: 'source-diff-godo25',
        sidebarPath: './sidebars-auto.js',
        sidebarItemsGenerator: reverseChronologicalSidebar,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'source-diff-godo26',
        path: 'docs/source-diff-godo26',
        routeBasePath: 'source-diff-godo26',
        sidebarPath: './sidebars-auto.js',
        sidebarItemsGenerator: reverseChronologicalSidebar,
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
      },
      navbar: {
        title: '고도몰 개발자 센터',
        items: [
          {
            type: 'dropdown',
            label: '릴리즈노트',
            position: 'left',
            items: [
              {to: '/release-notes-godo25', label: 'Godo25'},
              {to: '/release-notes-godo26', label: 'Godo26'},
            ],
          },
          {
            type: 'dropdown',
            label: '소스 diff',
            position: 'left',
            items: [
              {to: '/source-diff-godo25', label: 'Godo25'},
              {to: '/source-diff-godo26', label: 'Godo26'},
            ],
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} NHN Commerce.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
