import React from 'react';
import ReactMarkdown from 'react-markdown';
import './index.css';
import './light.css';
import './dark.css';

function ContestTheory({ contest_theory }) {
  return (
    <div className="contest-theory-section">
      <h3>Theory Behind the Contest 🧠</h3>
      <ReactMarkdown
        components={{
          // Custom component to prevent <p> tags from wrapping <div>s (e.g., from BlockMath)
          p: ({ children }) => {
            if (children && children[0] && children[0].props && children[0].props.node && children[0].props.node.tagName === 'div') {
              return children;
            }
            return <p>{children}</p>;
          },
        }}
      >{contest_theory}</ReactMarkdown>
    </div>
  );
}

export default ContestTheory;
