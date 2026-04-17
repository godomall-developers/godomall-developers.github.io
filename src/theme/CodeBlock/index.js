import React, {useEffect, useRef} from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import {html} from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

// 50줄 이상인 diff는 자동으로 <details>로 감싸서 접어준다.
const COLLAPSE_THRESHOLD = 50;

export default function CodeBlockWrapper(props) {
  const diffRef = useRef(null);

  const diffText = typeof props.children === 'string' ? props.children : '';

  // diff 언어인지 확인
  const isDiff =
    props.className === 'language-diff' ||
    props.metastring?.includes('diff') ||
    diffText.trimStart().startsWith('diff --git');

  const lineCount = isDiff ? diffText.trimEnd().split('\n').length : 0;
  const shouldCollapse = isDiff && lineCount >= COLLAPSE_THRESHOLD;

  useEffect(() => {
    if (!isDiff || !diffRef.current) return;
    if (!diffText) return;

    const diffHtml = html(diffText, {
      outputFormat: 'side-by-side',
      drawFileList: false,
      matching: 'lines',
      colorScheme: 'auto',
    });

    diffRef.current.innerHTML = diffHtml;
  }, [isDiff, diffText]);

  if (isDiff) {
    const viewer = <div ref={diffRef} className="diff-viewer" />;
    if (shouldCollapse) {
      return (
        <details className="diff-collapsible">
          <summary>{lineCount}줄 변경 — 클릭하여 펼치기</summary>
          {viewer}
        </details>
      );
    }
    return viewer;
  }

  return <CodeBlock {...props} />;
}
