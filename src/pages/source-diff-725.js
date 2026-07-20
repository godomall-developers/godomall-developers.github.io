import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';

export default function SourceDiff725() {
  const data = usePluginData('source-diff-data') ?? {};
  const dates = data['725'] ?? [];

  return (
    <Layout title="소스 diff (PHP 7 · GODO25)" description="PHP 7 · GODO25 소스 변경 내역">
      <header className="ncua-page-title">
        <div className="ncua-page-title__page-header">
          <div className="ncua-page-title__header ncua-page-title__header--has-breadcrumb">
            <div className="ncua-page-title__container">
              <nav className="ncua-page-title__breadcrumb" aria-label="breadcrumb">
                <span className="ncua-page-title__breadcrumb-item">
                  <Link to="/">홈</Link>
                </span>
                <svg className="ncua-page-title__breadcrumb-separator" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="none">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6"/>
                </svg>
                <span className="ncua-page-title__breadcrumb-current">소스 diff (PHP 7 · GODO25)</span>
              </nav>
              <div className="ncua-page-title__title-row">
                <h1 className="ncua-page-title__title">소스 diff (PHP 7 · GODO25)</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="dc-timeline-wrap">
        <div className="block" style={{ maxWidth: 600 }}>
          <div className="block__header">
            <span className="block__title">날짜별 변경 내역</span>
            <span className="block__summary">총 <b>{dates.length}</b>건</span>
          </div>
          <div className="block__body" style={{ padding: '12px 16px' }}>
            {dates.length === 0 && (
              <p style={{ color: 'var(--gray-400)', fontSize: 13, padding: 8 }}>항목 없음</p>
            )}
            {dates.map(date => (
              <Link
                key={date}
                className="src-item"
                to={`/source-diff-725/${date}`}
                style={{ display: 'flex', padding: '10px 16px' }}
              >
                <span className="src-item__name">{date}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
