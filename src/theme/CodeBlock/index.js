import React, {useEffect, useRef} from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import {html} from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

export default function CodeBlockWrapper(props) {
  const diffRef = useRef(null);

  // diff 언어인지 확인
  const isDiff =
    props.className === 'language-diff' ||
    props.metastring?.includes('diff') ||
    (typeof props.children === 'string' && props.children.trimStart().startsWith('diff --git'));

  useEffect(() => {
    if (!isDiff || !diffRef.current) return;

    const diffText = typeof props.children === 'string' ? props.children : '';
    if (!diffText) return;

    const diffHtml = html(diffText, {
      outputFormat: 'side-by-side',
      drawFileList: false,
      matching: 'lines',
      colorScheme: 'auto',
    });

    diffRef.current.innerHTML = diffHtml;
  }, [isDiff, props.children]);

  if (isDiff) {
    return <div ref={diffRef} className="diff-viewer" />;
  }

  return <CodeBlock {...props} />;
}
