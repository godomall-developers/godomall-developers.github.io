import React from 'react';
import Layout from '@theme/Layout';
import {usePluginData} from '@docusaurus/useGlobalData';
import ReleaseTimeline from '@site/src/components/ReleaseTimeline';

function groupByMonth(dates) {
  const map = new Map();
  for (const entry of dates) {
    const [year, month] = entry.date.split('-');
    const label = `${year}년 ${parseInt(month)}월`;
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(entry);
  }
  return [...map.entries()].map(([label, dates]) => ({ label, dates }));
}

export default function ReleaseNotes826() {
  const data = usePluginData('release-notes-data') ?? {};
  const months = groupByMonth(data['826'] ?? []);

  return (
    <Layout title="릴리즈노트 (PHP 8 · GODO26)" description="PHP 8 · GODO26 릴리즈노트">
      <ReleaseTimeline title="릴리즈노트 (PHP 8 · GODO26)" version="PHP 8 · GODO26" months={months} />
    </Layout>
  );
}
