import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

// ── Unified diff → side-by-side pairs ────────────────────────────────────────
// Returns Array<{ before: Line|null, after: Line|null }>
// Line = { lineNo: number, text: string, type: 'context'|'removed'|'added' }

function parseSideBySide(diffText) {
  if (!diffText) return [];

  const lines  = diffText.split('\n');
  const result = [];
  let removed  = [];
  let added    = [];
  let bNo      = 1;
  let aNo      = 1;

  function flush() {
    const max = Math.max(removed.length, added.length);
    for (let i = 0; i < max; i++) {
      result.push({ before: removed[i] ?? null, after: added[i] ?? null });
    }
    removed = [];
    added   = [];
  }

  for (const line of lines) {
    // skip headers / "No newline" notice
    if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('\\')) continue;

    const hm = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hm) {
      flush();
      bNo = +hm[1];
      aNo = +hm[2];
      continue;
    }

    if (line.startsWith('-')) {
      removed.push({ lineNo: bNo++, text: line.slice(1), type: 'removed' });
    } else if (line.startsWith('+')) {
      added.push({ lineNo: aNo++, text: line.slice(1), type: 'added' });
    } else {
      flush();
      const text = line.startsWith(' ') ? line.slice(1) : line;
      result.push({
        before: { lineNo: bNo++, text, type: 'context' },
        after:  { lineNo: aNo++, text, type: 'context' },
      });
    }
  }

  flush();
  return result;
}

// ── One code pane (before / after) ───────────────────────────────────────────

function DiffPane({ label, labelCls, filePath, rows, side }) {
  const fileName = filePath.split('/').pop();
  return (
    <div className="pw-diff-pane">
      <div className="pw-diff-pane__header">
        <span className={`pw-diff-pane__label ${labelCls}`}>{label}</span>
        <span className="pw-diff-pane__path">{fileName}</span>
      </div>
      <div className="pw-diff-pane__code">
        <table className="hljs-ln">
          <tbody>
            {rows.map((row, i) => {
              if (row === null) {
                return (
                  <tr key={i} className="hljs-ln-line pw-diff-line--placeholder">
                    <td className="hljs-ln-numbers"><span className="hljs-ln-n" data-line-number=" " /></td>
                    <td className="hljs-ln-code">&nbsp;</td>
                  </tr>
                );
              }
              const rowCls = [
                'hljs-ln-line',
                side === 'before' && row.type === 'removed' ? 'pw-diff-line--removed' : '',
                side === 'after'  && row.type === 'added'   ? 'pw-diff-line--added'   : '',
              ].filter(Boolean).join(' ');
              return (
                <tr key={i} className={rowCls}>
                  <td className="hljs-ln-numbers">
                    <span className="hljs-ln-n" data-line-number={row.lineNo} />
                  </td>
                  <td className="hljs-ln-code">{row.text || '\u00a0'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Single file diff block ────────────────────────────────────────────────────

function DiffFileBlock({ id, filePath, diffText }) {
  const pairs    = parseSideBySide(diffText);
  const before   = pairs.map(p => p.before);
  const after    = pairs.map(p => p.after);
  const addCnt   = after .filter(r => r?.type === 'added'  ).length;
  const delCnt   = before.filter(r => r?.type === 'removed').length;

  return (
    <div className="diff-file" id={id}>
      <div className="diff-file__bar">
        <span className="diff-file__name">{filePath}</span>
        <span className="diff-file__lines">
          {addCnt > 0 && <span className="stat-add">+{addCnt}</span>}
          {delCnt > 0 && <span className="stat-del">-{delCnt}</span>}
        </span>
      </div>
      {diffText ? (
        <div className="pw-diff-view">
          <DiffPane
            label="변경 전" labelCls="pw-diff-pane__label--old"
            filePath={filePath} rows={before} side="before"
          />
          <DiffPane
            label="변경 후" labelCls="pw-diff-pane__label--new"
            filePath={filePath} rows={after} side="after"
          />
        </div>
      ) : (
        <p className="sdv-no-diff">diff 데이터 없음</p>
      )}
    </div>
  );
}

// ── Breadcrumb chevron ────────────────────────────────────────────────────────

const ChevronRight = () => (
  <svg
    className="ncua-page-title__breadcrumb-separator"
    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    fill="none" viewBox="0 0 24 24" stroke="none"
  >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6"/>
  </svg>
);

// ── Shared page header ────────────────────────────────────────────────────────

function PageHeader({ version, date, subtitle }) {
  const versionLabel   = version === 'godo25' ? 'GODO 25' : 'GODO 26';
  const releaseNotesTo = `/release-notes-${version}`;
  return (
    <header className="ncua-page-title sdv-page-title">
      <div className="ncua-page-title__page-header">
        <div className="ncua-page-title__header ncua-page-title__header--has-breadcrumb">
          <div className="ncua-page-title__container">
            <nav className="ncua-page-title__breadcrumb" aria-label="breadcrumb">
              <span className="ncua-page-title__breadcrumb-item">
                <Link to="/">홈</Link>
              </span>
              <ChevronRight />
              <span className="ncua-page-title__breadcrumb-item">
                <Link to={releaseNotesTo}>릴리즈노트</Link>
              </span>
              <ChevronRight />
              <span className="ncua-page-title__breadcrumb-current">소스 변경 전체 보기</span>
            </nav>
            <div className="ncua-page-title__title-row">
              <h1 className="ncua-page-title__title">소스 변경 전체 보기</h1>
              <span className="dc-version-pill">
                <span className="dc-version-pill__dot" />
                {versionLabel}
              </span>
            </div>
            <span className="page-title__sub">{subtitle}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Diff legend ───────────────────────────────────────────────────────────────

function DiffLegend() {
  return (
    <div className="pw-diff-legend">
      <span className="pw-diff-legend__item">
        <span className="pw-diff-legend__swatch pw-diff-legend__swatch--added" />
        추가
      </span>
      <span className="pw-diff-legend__item">
        <span className="pw-diff-legend__swatch pw-diff-legend__swatch--removed" />
        삭제
      </span>
    </div>
  );
}

// ── Shared file list sidebar renderer ─────────────────────────────────────────
// files: Array<{ path, status, anchorId }>

function FileListSidebar({ totalCount, files }) {
  const groups = {};
  files.forEach(f => {
    const parts = f.path.split('/');
    const group = parts.length > 1 ? parts[0] : '기타';
    if (!groups[group]) groups[group] = [];
    groups[group].push(f);
  });
  return (
    <section className="block block--source-list" aria-labelledby="srcListTitle">
      <div className="block__header">
        <span className="block__title" id="srcListTitle">변경 파일 목록</span>
        <span className="block__summary">총 <b>{totalCount}</b>개</span>
      </div>
      <div className="block__body">
        {Object.entries(groups).map(([group, groupFiles]) => (
          <div key={group}>
            <div className="src-group">
              {group}{' '}
              <span style={{ fontWeight: 400, fontSize: 11, color: 'var(--gray-400)' }}>
                ({groupFiles.length})
              </span>
            </div>
            {groupFiles.map(f => {
              const parts = f.path.split('/');
              const name  = parts[parts.length - 1];
              const dir   = parts.slice(1, -1).join('/') + (parts.length > 2 ? '/' : '');
              return (
                <a key={f.anchorId} className="src-item" href={`#${f.anchorId}`}>
                  <span className="src-item__body">
                    <span className="src-item__name">{name}</span>
                    {dir && <span className="src-item__path">{dir}</span>}
                  </span>
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Single diff page ──────────────────────────────────────────────────────────

function SingleDiffPage({ pageData }) {
  const { date, version, fileCount, files, diffs } = pageData;
  const versionLabel = version === 'godo25' ? 'GODO 25' : 'GODO 26';

  const sidebarFiles = files.map((f, i) => ({ ...f, anchorId: `file-${i}` }));
  const totalCount   = fileCount;

  return (
    <Layout title={`${date} 소스 변경 비교 | ${versionLabel}`}>
      <PageHeader version={version} date={date} subtitle={`${date} · 변경 파일 수: ${totalCount}개`} />
      <div className="sdv-page-content">
        <div className="dc-split">
          <FileListSidebar totalCount={totalCount} files={sidebarFiles} />
          <div className="block block--diff">
            <div className="block__header">
              <span className="block__title">변경 파일 코드</span>
              <DiffLegend />
            </div>
            <div className="diff-scroll">
              {files.map((f, i) => (
                <DiffFileBlock
                  key={i}
                  id={`file-${i}`}
                  filePath={f.path}
                  diffText={diffs[f.path]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ── Combined diff page (전체 보기) ─────────────────────────────────────────────

function CombinedDiffPage({ pageData }) {
  const { date, version, items } = pageData;
  const versionLabel = version === 'godo25' ? 'GODO 25' : 'GODO 26';

  const totalCount = items.reduce((sum, item) => sum + (item.fileCount || 0), 0);

  return (
    <Layout title={`${date} 소스 변경 전체 보기 | ${versionLabel}`}>
      <PageHeader version={version} date={date} subtitle={`${date} · 변경 파일 수: ${totalCount}개`} />
      <div className="sdv-page-content">
        <div className="dc-split">

          {/* Left — item name 기준 그룹 */}
          <section className="block block--source-list" aria-labelledby="srcListTitle">
            <div className="block__header">
              <span className="block__title" id="srcListTitle">변경 파일 목록</span>
              <span className="block__summary">총 <b>{totalCount}</b>개</span>
            </div>
            <div className="block__body">
              {items.map((item, gi) => (
                <div key={gi}>
                  <div className="src-group">{item.name}</div>
                  {(item.files || []).map((f, fi) => {
                    const parts = f.path.split('/');
                    const name  = parts[parts.length - 1];
                    const dir   = parts.length > 1 ? parts.slice(0, -1).join('/') + '/' : '';
                    return (
                      <a key={fi} className="src-item" href={`#g${gi}-f${fi}`}>
                        <span className="src-item__body">
                          <span className="src-item__name">{name}</span>
                          {dir && <span className="src-item__path">{dir}</span>}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          {/* Right — diff view */}
          <div className="block block--diff">
            <div className="block__header">
              <span className="block__title">변경 파일 코드</span>
              <DiffLegend />
            </div>
            <div className="diff-scroll">
              {items.map((item, gi) => (
                <div key={gi}>
                  <div className="diff-group-bar">{item.name}</div>
                  {(item.files || []).map((f, fi) => (
                    <DiffFileBlock
                      key={fi}
                      id={`g${gi}-f${fi}`}
                      filePath={f.path}
                      diffText={item.diffs?.[f.path]}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function SourceDiffPage({ pageData }) {
  return Array.isArray(pageData.items)
    ? <CombinedDiffPage pageData={pageData} />
    : <SingleDiffPage pageData={pageData} />;
}
