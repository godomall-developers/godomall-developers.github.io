import React from 'react';
import Link from '@docusaurus/Link';
import {useHistory, useLocation} from '@docusaurus/router';

// ─── Icons ────────────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  </svg>
);

const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  </svg>
);

const ExtLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
);

const CaretDownIcon = () => (
  <svg className="dc-month-group__caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="ncua-page-title__breadcrumb-separator" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="none">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6"/>
  </svg>
);

// ─── Security detection ───────────────────────────────────────────────────────

const SECURITY_RE = /XSS|Injection|SSRF|보안\s*취약점|ModSecurity|eval\(\)/;

function isSecurityItem(name) {
  return SECURITY_RE.test(name);
}

// ─── Patch type filter ────────────────────────────────────────────────────────
// patchTypes 는 docusaurus.config.js 의 classifyPatchTypes 가 변경 파일 경로로 채운다.

const PATCH_TYPES = [
  { key: 'admin', label: '관리자 패치' },
  { key: 'skin', label: '스킨 패치' },
];
const FILTERS = [{ key: 'all', label: '전체' }, ...PATCH_TYPES];

function filterMonths(months, filter) {
  if (filter === 'all') return months;
  return months
    .map((month) => ({
      ...month,
      dates: month.dates
        .map((d) => ({
          ...d,
          groups: d.groups
            .map((g) => ({ ...g, items: g.items.filter((item) => item.patchTypes?.includes(filter)) }))
            .filter((g) => g.items.length > 0),
        }))
        .filter((d) => d.groups.length > 0),
    }))
    .filter((month) => month.dates.length > 0);
}

function PatchTag({ type }) {
  const def = PATCH_TYPES.find((t) => t.key === type);
  if (!def) return null;
  return <span className={`dc-patch-tag dc-patch-tag--${type}`}>{def.label}</span>;
}

function PatchFilter({ value, onChange }) {
  return (
    <div className="dc-patch-filter" role="group" aria-label="패치 유형 모아보기">
      <span className="dc-patch-filter__label">모아보기</span>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          className={`dc-patch-filter__chip${value === f.key ? ' is-active' : ''}`}
          aria-pressed={value === f.key}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PatchItem({ name, descs, diffPath, patchTypes }) {
  const secure = isSecurityItem(name);
  const inner = (
    <>
      <span className="dc-patch-item__icon">
        {secure ? <ShieldIcon /> : <GearIcon />}
      </span>
      <span className="dc-patch-item__body">
        <span className="dc-patch-item__name-row">
          <span className="dc-patch-item__name">{name}</span>
          {patchTypes && patchTypes.map((type) => <PatchTag key={type} type={type} />)}
        </span>
        {descs && descs.map((desc, i) => (
          <span key={i} className="dc-patch-item__desc">{desc}</span>
        ))}
      </span>
      {diffPath && (
        <span className="dc-patch-item__ext"><ExtLinkIcon /></span>
      )}
    </>
  );
  return (
    <li className={`dc-patch-item${secure ? '' : ' dc-patch-item--feature'}`}>
      {diffPath
        ? <Link className="dc-patch-item__link" to={diffPath}>{inner}</Link>
        : <div className="dc-patch-item__row">{inner}</div>
      }
    </li>
  );
}

function DateCard({ date, diffPath, groups }) {
  const items = groups.flatMap((g) => g.items);
  const patchCounts = PATCH_TYPES
    .map((t) => ({ ...t, count: items.filter((item) => item.patchTypes?.includes(t.key)).length }))
    .filter((t) => t.count > 0)
    .map((t) => `${t.label} ${t.count}건`);
  const summaryTitle = [...groups.map((g) => `${g.type} ${g.items.length}건`), ...patchCounts]
    .join(' · ');
  const showGroupLabels = groups.length > 1;

  return (
    <div className="dc-date-row">
      <span className="dc-date-label">{date}</span>
      <div className="dc-date-card">
        <div className="dc-date-card__header">
          <span className="dc-date-card__title">{summaryTitle}</span>
          {diffPath && <Link className="dc-btn-all" to={diffPath}>전체 보기</Link>}
        </div>
        {groups.map((group) => (
          <div key={group.type} className="dc-patch-group">
            {showGroupLabels && (
              <div className="dc-patch-group__label">{group.type}</div>
            )}
            <ul className="dc-patch-list">
              {group.items.map((item) => (
                <PatchItem key={item.issueId ?? item.name} name={item.name} descs={item.descs} diffPath={item.diffPath} patchTypes={item.patchTypes} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthGroup({ label, dates }) {
  const totalCount = dates.reduce(
    (acc, d) => acc + d.groups.reduce((a, g) => a + g.items.length, 0),
    0,
  );

  return (
    <details className="dc-month-group" open>
      <summary>
        <span className="dc-month-group__label">
          {label} <span className="dc-month-group__count">{totalCount}건</span>
        </span>
        <CaretDownIcon />
      </summary>
      {dates.map((d) => (
        <DateCard key={d.date} {...d} />
      ))}
    </details>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ReleaseTimeline({ title, version, months }) {
  // 선택한 필터를 ?patch= 로 남겨 링크로 공유할 수 있게 한다
  const location = useLocation();
  const history = useHistory();
  const queryValue = new URLSearchParams(location.search).get('patch');
  const filter = PATCH_TYPES.some((t) => t.key === queryValue) ? queryValue : 'all';
  const setFilter = (next) => {
    const params = new URLSearchParams(location.search);
    if (next === 'all') params.delete('patch');
    else params.set('patch', next);
    const search = params.toString();
    history.replace({ ...location, search: search ? `?${search}` : '' });
  };
  const visibleMonths = filterMonths(months, filter);

  return (
    <>
      <header className="ncua-page-title">
        <div className="ncua-page-title__page-header">
          <div className="ncua-page-title__header ncua-page-title__header--has-breadcrumb">
            <div className="ncua-page-title__container">
              <nav className="ncua-page-title__breadcrumb" aria-label="breadcrumb">
                <span className="ncua-page-title__breadcrumb-item">
                  <Link to="/">홈</Link>
                </span>
                <ChevronRightIcon />
                <span className="ncua-page-title__breadcrumb-item">릴리즈노트</span>
                <ChevronRightIcon />
                <span className="ncua-page-title__breadcrumb-current">{version}</span>
              </nav>
              <div className="ncua-page-title__title-row">
                <h1 className="ncua-page-title__title">{title}</h1>
              </div>
              <PatchFilter value={filter} onChange={setFilter} />
            </div>
          </div>
        </div>
      </header>

      <main className="dc-timeline-wrap">
        {visibleMonths.length === 0 ? (
          <div className="dc-filter-empty">해당 유형의 패치 내역이 없습니다.</div>
        ) : (
          visibleMonths.map((month) => (
            <MonthGroup key={month.label} label={month.label} dates={month.dates} />
          ))
        )}
      </main>
    </>
  );
}
