import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const sections = [
  {
    icon: '📋',
    title: '릴리즈노트 (Godo25)',
    description: 'Godo25 버전별 변경사항을 확인할 수 있습니다.',
    link: '/release-notes-godo25',
    color: '#e8f4fd',
    darkColor: '#1a2a3a',
  },
  {
    icon: '📋',
    title: '릴리즈노트 (Godo26)',
    description: 'Godo26 버전별 변경사항을 확인할 수 있습니다.',
    link: '/release-notes-godo26',
    color: '#e8f4fd',
    darkColor: '#1a2a3a',
  },
  {
    icon: '🔍',
    title: '소스 diff (Godo25)',
    description: 'Godo25 소스 파일 변경 내역을 확인할 수 있습니다.',
    link: '/source-diff-godo25',
    color: '#fdf2e8',
    darkColor: '#3a2a1a',
  },
  {
    icon: '🔍',
    title: '소스 diff (Godo26)',
    description: 'Godo26 소스 파일 변경 내역을 확인할 수 있습니다.',
    link: '/source-diff-godo26',
    color: '#fdf2e8',
    darkColor: '#3a2a1a',
  },
];

function Card({icon, title, description, link, color, darkColor}) {
  return (
    <Link
      to={link}
      style={{textDecoration: 'none', color: 'inherit'}}
    >
      <div style={{
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--ifm-color-emphasis-200)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--ifm-color-emphasis-100)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      >
        <div style={{fontSize: '1.8rem', marginBottom: '0.75rem'}}>{icon}</div>
        <h3 style={{
          margin: '0 0 0.5rem',
          fontSize: '1.05rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
        }}>{title}</h3>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: 'var(--ifm-color-emphasis-600)',
          lineHeight: 1.6,
        }}>{description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout title="Home" description="고도몰 개발자 센터">
      <main style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '4rem 2rem',
      }}>
        {/* 인사 영역 */}
        <div style={{marginBottom: '3rem'}}>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--ifm-color-emphasis-500)',
            marginBottom: '0.5rem',
            fontWeight: 400,
          }}>
            Welcome
          </p>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: '0.75rem',
            lineHeight: 1.3,
          }}>
            어서오세요,<br />
            고도몰 개발자 센터입니다.
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--ifm-color-emphasis-600)',
            lineHeight: 1.7,
            maxWidth: '520px',
          }}>
            릴리즈노트와 소스 변경 내역을 확인할 수 있습니다.<br />
            아래 항목을 선택하거나, 좌측 메뉴를 이용해주세요.
          </p>
        </div>

        {/* 구분선 */}
        <hr style={{
          border: 'none',
          borderTop: '1px solid var(--ifm-color-emphasis-200)',
          marginBottom: '2rem',
        }} />

        {/* 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}>
          {sections.map((s) => (
            <Card key={s.link} {...s} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
