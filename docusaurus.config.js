import {themes as prismThemes} from 'prism-react-renderer';

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
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'release-notes-godo26',
        path: 'docs/release-notes-godo26',
        routeBasePath: 'release-notes-godo26',
        sidebarPath: './sidebars-auto.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'source-diff-godo25',
        path: 'docs/source-diff-godo25',
        routeBasePath: 'source-diff-godo25',
        sidebarPath: './sidebars-auto.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'source-diff-godo26',
        path: 'docs/source-diff-godo26',
        routeBasePath: 'source-diff-godo26',
        sidebarPath: './sidebars-auto.js',
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
          {
            href: 'https://github.com/godomall-developers/godomall-developers.github.io',
            label: 'GitHub',
            position: 'right',
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
