import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Godomall Developers',
  tagline: 'Release Notes & Source Diff',
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
        title: 'Godomall Developers',
        items: [
          {
            to: '/release-notes-godo25',
            label: '릴리즈노트(Godo25)',
            position: 'left',
          },
          {
            to: '/release-notes-godo26',
            label: '릴리즈노트(Godo26)',
            position: 'left',
          },
          {
            to: '/source-diff-godo25',
            label: '소스 diff(Godo25)',
            position: 'left',
          },
          {
            to: '/source-diff-godo26',
            label: '소스 diff(Godo26)',
            position: 'left',
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
        copyright: `Copyright © ${new Date().getFullYear()} NHN Commerce. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
