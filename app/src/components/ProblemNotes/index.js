import React from 'react';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import './index.css';
import './light.css';
import './dark.css';

function ProblemNotes({ notes_content }) {
  if (!notes_content) {
    return null;
  }

  return (
    <div className="problem-notes-section">
      <h3>Notes 🗒️</h3>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          math: ({ value }) => <BlockMath>{value}</BlockMath>,
          inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
          p: ({ children }) => {
            if (children && children[0] && children[0].props && children[0].props.node && children[0].props.node.tagName === 'div') {
              return children;
            }
            return <p>{children}</p>;
          },
        }}
      >
        {notes_content}
      </ReactMarkdown>
    </div>
  );
}

export default ProblemNotes;
