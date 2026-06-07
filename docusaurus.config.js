import {themes as prismThemes} from 'prism-react-renderer';
import fs from 'fs';
import path from 'path';

// ─── 소스 diff MD 파싱: 파일 목록 + diff 텍스트 추출 ──────────────────────────
function parseSourceDiff(content) {
  let fileCount = 0;
  const files = [];
  const diffs = {};

  // 변경 파일 수
  const countMatch = content.match(/변경 파일 수:\s*(\d+)개/);
  if (countMatch) fileCount = parseInt(countMatch[1]);

  // 파일 목록 테이블 | M | `path` |
  const tableRowRe = /^\|\s*(M|A|D)\s*\|\s*`([^`]+)`\s*\|/gm;
  let m;
  while ((m = tableRowRe.exec(content)) !== null) {
    files.push({ status: m[1], path: m[2] });
  }

  // ### 파일경로 + ```diff 블록 파싱
  const sections = content.split(/^### /m).slice(1);
  for (const section of sections) {
    const firstLine = section.split('\n')[0].trim();
    const diffMatch = section.match(/```diff\n([\s\S]*?)```/);
    if (diffMatch) {
      const existing = diffs[firstLine];
      diffs[firstLine] = existing ? existing + '\n' + diffMatch[1] : diffMatch[1];
    }
  }

  // 테이블이 없는 경우 diff 키에서 파일 목록 보완
  if (files.length === 0) {
    for (const p of Object.keys(diffs)) {
      files.push({ status: 'M', path: p });
    }
    fileCount = files.length;
  }

  return { fileCount, files, diffs };
}

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

// ─── 소스 diff 데이터 플러그인 + 라우트 생성 ───────────────────────────────────
async function sourceDiffDataPlugin(context) {
  return {
    name: 'source-diff-data',
    async loadContent() {
      const versions = ['godo25', 'godo26'];
      const data = {};
      for (const version of versions) {
        const dir = path.join(context.siteDir, 'docs', `source-diff-${version}`);
        if (!fs.existsSync(dir)) { data[version] = []; continue; }
        const files = fs.readdirSync(dir)
          .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
          .sort().reverse();
        data[version] = files.map(file => {
          const date = file.replace('.md', '');
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          return { date, version, ...parseSourceDiff(content) };
        });
      }
      return data;
    },
    async contentLoaded({ content, actions }) {
      const { addRoute, setGlobalData, createData } = actions;
      // 인덱스 페이지용 요약 데이터
      const summary = {};
      for (const [v, dates] of Object.entries(content)) {
        summary[v] = dates.map(d => d.date);
      }
      setGlobalData(summary);
      // 날짜별 페이지 라우트 생성
      for (const [version, dates] of Object.entries(content)) {
        for (const dateData of dates) {
          const dataPath = await createData(
            `source-diff-${version}-${dateData.date}.json`,
            JSON.stringify(dateData),
          );
          addRoute({
            path: `/source-diff-${version}/${dateData.date}`,
            component: '@site/src/components/SourceDiffPage',
            modules: { pageData: dataPath },
            exact: true,
          });
        }
      }
    },
  };
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
    sourceDiffDataPlugin,
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
