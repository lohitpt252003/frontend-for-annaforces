import React from 'react';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import './index.css';
import './light.css';
import './dark.css';

function ProblemOutputFormat({ output_content }) {
  return (
    <div className="problem-output-format-section">
      <h3>Output Format 📤</h3>
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
        {output_content}
      </ReactMarkdown>
    </div>
  );
}

export default ProblemOutputFormat;
