#!/usr/bin/env node
/**
 * source diff 파일 임포트 스크립트
 *
 * Usage:
 *   node scripts/import-diffs.js <YYYY-MM-DD> <input-dir>
 *
 * Example:
 *   node scripts/import-diffs.js 2026-06-01 release-artifacts/issue-diffs
 *
 * 파일명 규칙:
 *   SOURCE_DIFF-{version}.md           → docs/source-diff-{version}/{date}/all.md
 *   SOURCE_DIFF-{version}-{issueId}.md → docs/source-diff-{version}/{date}/{issueId}.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const [,, date, inputDir] = process.argv;

if (!date || !inputDir) {
  console.error('Usage: node scripts/import-diffs.js <YYYY-MM-DD> <input-dir>');
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력하세요.');
  process.exit(1);
}

const inputPath = path.resolve(ROOT, inputDir);
if (!fs.existsSync(inputPath)) {
  console.error(`입력 디렉토리를 찾을 수 없습니다: ${inputPath}`);
  process.exit(1);
}

const files = fs.readdirSync(inputPath).filter(f => f.endsWith('.md'));
let count = 0;

// 구 버전 토큰 → 폴더 토큰. 기존 godo25/godo26 산출물은 PHP 8 기준이었다.
const LEGACY_VERSION_ALIASES = { godo25: '825', godo26: '826' };
const resolveVersion = (token) => {
  const v = token.toLowerCase();
  return LEGACY_VERSION_ALIASES[v] ?? v;
};

for (const file of files) {
  let version, destName;

  // SOURCE_DIFF-{version}-{issueId}.md → {issueId}.md
  const issueMatch = file.match(/^SOURCE_DIFF-((?:godo)?\d+)-(\d+)\.md$/i);
  if (issueMatch) {
    version = resolveVersion(issueMatch[1]);
    destName = `${issueMatch[2]}.md`;
  }

  // SOURCE_DIFF-{version}.md → all.md (이슈번호 없음 = 날짜 전체)
  if (!issueMatch) {
    const allMatch = file.match(/^SOURCE_DIFF-((?:godo)?\d+)\.md$/i);
    if (allMatch) {
      version = resolveVersion(allMatch[1]);
      destName = 'all.md';
    }
  }

  if (!version) {
    console.warn(`건너뜀 (패턴 불일치): ${file}`);
    continue;
  }

  const destDir = path.join(ROOT, 'docs', `source-diff-${version}`, date);
  fs.mkdirSync(destDir, { recursive: true });

  const dest = path.join(destDir, destName);
  fs.copyFileSync(path.join(inputPath, file), dest);
  console.log(`✓  ${file}  →  docs/source-diff-${version}/${date}/${destName}`);
  count++;
}

console.log(`\n완료: ${count}개 파일 임포트`);
