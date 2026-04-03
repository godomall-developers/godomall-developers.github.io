import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const sections = [
  {
    title: '릴리즈노트 (Godo25)',
    description: 'Godo25 버전 릴리즈노트',
    link: '/release-notes-godo25',
  },
  {
    title: '릴리즈노트 (Godo26)',
    description: 'Godo26 버전 릴리즈노트',
    link: '/release-notes-godo26',
  },
  {
    title: '소스 diff (Godo25)',
    description: 'Godo25 소스 변경 내역',
    link: '/source-diff-godo25',
  },
  {
    title: '소스 diff (Godo26)',
    description: 'Godo26 소스 변경 내역',
    link: '/source-diff-godo26',
  },
];

export default function Home() {
  return (
    <Layout title="Home" description="Godomall Developers Documentation">
      <main style={{padding: '2rem', maxWidth: '960px', margin: '0 auto'}}>
        <h1>Godomall Developers</h1>
        <p>릴리즈노트 및 소스 변경 내역을 확인할 수 있습니다.</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}>
          {sections.map((s) => (
            <Link
              key={s.link}
              to={s.link}
              style={{
                display: 'block',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--ifm-color-emphasis-300)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <h3 style={{margin: 0}}>{s.title}</h3>
              <p style={{margin: '0.5rem 0 0', color: 'var(--ifm-color-emphasis-600)'}}>
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
