import React from 'react';
import ReactMarkdown from 'react-markdown';
import './index.css';
import './light.css';
import './dark.css';

function ContestDescription({ contest_description }) {
  return (
    <div className="contest-description-section">
      <h3>Description 📝</h3>
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
      >{contest_description}</ReactMarkdown>
    </div>
  );
}

export default ContestDescription;
