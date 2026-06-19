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
// items: [{ name, descs, issueId }]
// - 인덴트 서브 항목(    - 설명)은 descs 배열로 수집
// - 항목 이름 끝 (#숫자) 는 issueId 로 추출하고 표시 이름에서 제거
function parseGroups(content) {
  const groups = [];
  let cur = null;
  let curItem = null;

  const pushItem = () => {
    if (curItem && cur) { cur.items.push(curItem); curItem = null; }
  };

  for (const line of content.split('\n')) {
    const h3 = line.match(/^###\s+(.+)/);
    if (h3) {
      pushItem();
      if (cur) groups.push(cur);
      cur = { type: h3[1].trim(), items: [] };
    } else if (/^- /.test(line) && cur) {
      pushItem();
      const raw = line.slice(2).trim();
      const issueMatch = raw.match(/\s*\(#(\d+)\)\s*$/);
      const name = issueMatch ? raw.slice(0, issueMatch.index).trim() : raw;
      const issueId = issueMatch ? issueMatch[1] : null;
      curItem = { name, descs: [], issueId };
    } else if (/^\s+- /.test(line) && curItem) {
      curItem.descs.push(line.replace(/^\s+-\s*/, '').trim());
    }
  }
  pushItem();
  if (cur) groups.push(cur);
  return groups;
}

// ─── 이슈 diff 파일에서 issueId 추출 ─────────────────────────────────────────
// {issueId}.md 또는 SOURCE_DIFF-{version}-{issueId}.md → issueId
// 날짜 전체용 파일(all.md, SOURCE_DIFF-{version}.md)은 null 반환
function resolveIssueId(file) {
  if (/^\d+\.md$/.test(file)) return file.replace('.md', '');
  const m = file.match(/^SOURCE_DIFF-godo\d+-(\d+)\.md$/i);
  return m ? m[1] : null;
}

// ─── 소스 diff 데이터 플러그인 (개별 이슈 라우트 전용) ─────────────────────────
// 날짜별 전체 보기 라우트는 releaseNotesDataPlugin 이 담당
async function sourceDiffDataPlugin(context) {
  return {
    name: 'source-diff-data',
    getPathsToWatch() {
      return ['godo25', 'godo26'].map(v =>
        path.join(context.siteDir, 'docs', `source-diff-${v}`, '**', '*.md'),
      );
    },
    async loadContent() {
      const versions = ['godo25', 'godo26'];
      const data = {};
      for (const version of versions) {
        const dir = path.join(context.siteDir, 'docs', `source-diff-${version}`);
        if (!fs.existsSync(dir)) { data[version] = []; continue; }

        const entries = [];

        // 신포맷: 날짜 디렉터리 안의 이슈별 파일
        const dateDirs = fs.readdirSync(dir)
          .filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f))
          .filter(f => fs.statSync(path.join(dir, f)).isDirectory())
          .sort().reverse();

        for (const dateDir of dateDirs) {
          const datePath = path.join(dir, dateDir);
          for (const file of fs.readdirSync(datePath).filter(f => f.endsWith('.md'))) {
            const issueId = resolveIssueId(file);
            if (!issueId) continue;
            const content = fs.readFileSync(path.join(datePath, file), 'utf-8');
            entries.push({ date: issueId, version, ...parseSourceDiff(content) });
          }
        }

        // 레거시 포맷: 날짜 단위 flat 파일 (YYYY-MM-DD.md)
        const legacyFiles = fs.readdirSync(dir)
          .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
          .sort().reverse();

        for (const file of legacyFiles) {
          const date = file.replace('.md', '');
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          entries.push({ date, version, ...parseSourceDiff(content) });
        }

        data[version] = entries;
      }
      return data;
    },
    async contentLoaded({ content, actions }) {
      const { addRoute, createData } = actions;
      for (const [version, entries] of Object.entries(content)) {
        for (const entry of entries) {
          const dataPath = await createData(
            `source-diff-${version}-${entry.date}.json`,
            JSON.stringify(entry),
          );
          addRoute({
            path: `/source-diff-${version}/${entry.date}`,
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
// ─── 릴리즈노트 MD 자동 수집 플러그인 ─────────────────────────────────────────
// 날짜별 전체 보기(combined) 페이지도 여기서 생성:
//   이슈 diff 파일들을 릴리즈노트 항목 순서대로 묶어 자동 합산
async function releaseNotesDataPlugin(context) {
  return {
    name: 'release-notes-data',
    getPathsToWatch() {
      return ['godo25', 'godo26'].flatMap(v => [
        path.join(context.siteDir, 'docs', `release-notes-${v}`, '*.md'),
        path.join(context.siteDir, 'docs', `source-diff-${v}`, '**', '*.md'),
      ]);
    },
    async loadContent() {
      const versions = ['godo25', 'godo26'];
      const releaseNotes = {};
      const combinedPages = {};

      for (const version of versions) {
        const dir = path.join(context.siteDir, 'docs', `release-notes-${version}`);
        if (!fs.existsSync(dir)) { releaseNotes[version] = []; combinedPages[version] = []; continue; }

        const files = fs.readdirSync(dir)
          .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
          .sort().reverse();

        releaseNotes[version] = [];
        combinedPages[version] = [];

        for (const file of files) {
          const date = file.replace('.md', '');
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          const dateDiffDir = path.join(context.siteDir, 'docs', `source-diff-${version}`, date);

          // 이슈 diff 파일 탐색 헬퍼
          const findIssueDiff = (issueId) => {
            const candidates = [
              path.join(dateDiffDir, `${issueId}.md`),
              path.join(dateDiffDir, `SOURCE_DIFF-${version}-${issueId}.md`),
            ];
            return candidates.find(f => fs.existsSync(f)) ?? null;
          };

          // 그룹별 항목 파싱 + 개별 diff 경로 설정
          const groups = parseGroups(content).map(group => ({
            ...group,
            items: group.items.map(item => ({
              ...item,
              diffPath: item.issueId && findIssueDiff(item.issueId)
                ? `/source-diff-${version}/${item.issueId}`
                : null,
            })),
          }));

          // 날짜별 combined 페이지 구성 (이슈 diff 있는 항목만, 릴리즈노트 순서 유지)
          const combinedItems = groups
            .flatMap(g => g.items)
            .filter(item => item.issueId && item.diffPath)
            .map(item => {
              const diffFile = findIssueDiff(item.issueId);
              const diffContent = fs.readFileSync(diffFile, 'utf-8');
              return { name: item.name, issueId: item.issueId, ...parseSourceDiff(diffContent) };
            });

          const hasCombined = combinedItems.length > 0;
          if (hasCombined) {
            combinedPages[version].push({ date, version, items: combinedItems });
          }

          // 레거시: 이슈 단위 diff 없으면 날짜 단위 flat 파일 확인
          const legacyFlatFile = path.join(context.siteDir, 'docs', `source-diff-${version}`, `${date}.md`);
          const hasLegacy = !hasCombined && fs.existsSync(legacyFlatFile);

          releaseNotes[version].push({
            date,
            diffPath: hasCombined
              ? `/source-diff-${version}/${date}`
              : hasLegacy
                ? `/source-diff-${version}/${date}`
                : null,
            groups,
          });
        }
      }

      return { releaseNotes, combinedPages };
    },
    async contentLoaded({ content, actions }) {
      const { addRoute, setGlobalData, createData } = actions;
      // 릴리즈노트 타임라인 데이터 전역 노출
      setGlobalData(content.releaseNotes);

      // 날짜별 전체 보기 라우트 생성
      for (const [version, pages] of Object.entries(content.combinedPages)) {
        for (const pageData of pages) {
          const dataPath = await createData(
            `source-diff-combined-${version}-${pageData.date}.json`,
            JSON.stringify(pageData),
          );
          addRoute({
            path: `/source-diff-${version}/${pageData.date}`,
            component: '@site/src/components/SourceDiffPage',
            modules: { pageData: dataPath },
            exact: true,
          });
        }
      }
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
  favicon: 'img/godomall_favicon.png',

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
        gtag: {
          trackingID: 'G-MZEY2NEPRQ',
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
