import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
);

const sections = [
  {
    title: '릴리즈노트 (GODO 25)',
    link: '/release-notes-godo25',
  },
  {
    title: '릴리즈노트 (GODO 26)',
    link: '/release-notes-godo26',
  },
  {
    title: '소스 diff (GODO 25)',
    link: '/source-diff-godo25',
  },
  {
    title: '소스 diff (GODO 26)',
    link: '/source-diff-godo26',
  },
];

function Card({ title, link }) {
  return (
    <Link to={link} className="dc-entry-card">
      <span className="dc-entry-card__title">{title}</span>
      <span className="ncua-btn ncua-btn--sm ncua-btn--text dc-entry-card__cta">
        <span className="ncua-btn__label">바로가기</span>
        <ArrowRight />
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout title="Home" description="고도몰 개발자 센터">
      <main className="dc-home">
        <section className="dc-hero">
          <p className="dc-hero__eyebrow">Welcome</p>
          <h1 className="dc-hero__title">
            어서오세요,<br />
            고도몰 개발자 센터입니다.
          </h1>
          <p className="dc-hero__desc">
            버전을 선택하면 월별로 정리된 릴리즈노트와 소스 변경 내역을 확인할 수 있습니다.
          </p>
        </section>

        <div className="dc-card-grid">
          {sections.map((s) => (
            <Card key={s.link} {...s} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
