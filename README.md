# Godomall Developers - GitHub Pages

> https://godomall-developers.github.io/

릴리즈노트 및 소스 diff 문서 사이트입니다.  
`main` 브랜치에 머지되면 GitHub Actions가 자동으로 빌드 & 배포합니다.

---

## 문서 추가 방법

### 1. 폴더에 MD 파일 추가

| 메뉴 | 폴더 경로 |
|------|-----------|
| 릴리즈노트(Godo25) | `docs/release-notes-godo25/` |
| 릴리즈노트(Godo26) | `docs/release-notes-godo26/` |
| 소스 diff(Godo25) | `docs/source-diff-godo25/` |
| 소스 diff(Godo26) | `docs/source-diff-godo26/` |

### 2. MD 파일 작성 규칙

파일 최상단에 아래 frontmatter를 넣어주세요:

```markdown
---
title: "2026-04-03 릴리즈"
sidebar_position: 2
---

# 2026-04-03 릴리즈노트

여기에 본문 작성 (일반 마크다운 문법)
```

- `title` — 사이드바에 표시될 제목
- `sidebar_position` — 사이드바 정렬 순서 (숫자가 작을수록 위에 표시, 생략 가능)

### 3. 커밋 & PR

```bash
# 예시: Godo25 릴리즈노트 추가
git checkout -b release-note/2026-04-03
cp my-release-note.md docs/release-notes-godo25/2026-04-03.md
git add docs/release-notes-godo25/2026-04-03.md
git commit -m "docs: 2026-04-03 Godo25 릴리즈노트 추가"
git push origin release-note/2026-04-03
# → GitHub에서 PR 생성 → 머지 → 자동 배포
```

또는 **GitHub 웹에서 직접 파일 추가**도 가능합니다:
1. 해당 폴더로 이동
2. `Add file` → `Create new file`
3. 위 형식대로 작성 후 커밋

---

## 로컬 미리보기

```bash
npm install
npm start
# http://localhost:3000 에서 확인
```

---

## 폴더 구조

```
docs/
├── release-notes-godo25/   ← Godo25 릴리즈노트
│   ├── index.md             ← 메뉴 첫 페이지
│   └── 2026-04-03.md        ← 날짜별 문서 추가
├── release-notes-godo26/   ← Godo26 릴리즈노트
├── source-diff-godo25/     ← Godo25 소스 diff
└── source-diff-godo26/     ← Godo26 소스 diff
```
