import {themes as prismThemes} from 'prism-react-renderer';

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
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'release-notes-godo25',
        path: 'docs/release-notes-godo25',
        routeBasePath: 'release-notes-godo25',
        sidebarPath: './sidebars-auto.js',
        sidebarItemsGenerator: reverseChronologicalSidebar,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'release-notes-godo26',
        path: 'docs/release-notes-godo26',
        routeBasePath: 'release-notes-godo26',
        sidebarPath: './sidebars-auto.js',
        sidebarItemsGenerator: reverseChronologicalSidebar,
      },
    ],
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
        respectPrefersColorScheme: true,
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
