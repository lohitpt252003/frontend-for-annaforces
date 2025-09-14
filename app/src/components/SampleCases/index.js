import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify'; // Import toast
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX components
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

function SampleCases({ samples_data }) {
  const [copiedStatus, setCopiedStatus] = useState({});

  if (!samples_data || samples_data.length === 0) {
    return null;
  }

  const handleCopy = (text, id) => {
    const [type, indexStr] = id.split('-');
    const exampleNumber = parseInt(indexStr) + 1;
    const contentType = type.charAt(0).toUpperCase() + type.slice(1); // "Input" or "Output"

    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedStatus(prev => ({ ...prev, [id]: 'Copied!' }));
        toast.success(`${contentType} for Example ${exampleNumber} copied to clipboard!`); // Success toast
        setTimeout(() => {
          setCopiedStatus(prev => ({ ...prev, [id]: '' }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setCopiedStatus(prev => ({ ...prev, [id]: 'Failed to copy!' }));
        toast.error(`Failed to copy ${contentType} for Example ${exampleNumber} to clipboard!`); // Error toast
        setTimeout(() => {
          setCopiedStatus(prev => ({ ...prev, [id]: '' }));
        }, 2000);
      });
  };

  return (
    <div className="problem-detail-section">
      <h3>Sample Cases</h3>
      {samples_data.map((sample, index) => (
        <div key={index} className="problem-detail-sample">
          <h4>Example {index + 1}</h4>
          <p>
            <strong>Input:</strong>
            <button
              className="copy-button"
              onClick={() => handleCopy(sample.input, `input-${index}`)}
            >
              {copiedStatus[`input-${index}`] || 'Copy'}
            </button>
          </p>
          <pre>
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{
      math: ({ value }) => <BlockMath>{value}</BlockMath>,
      inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
    }}
  >
    {sample.input}
  </ReactMarkdown>
</pre>
          <p>
            <strong>Output:</strong>
            <button
              className="copy-button"
              onClick={() => handleCopy(sample.output, `output-${index}`)}
            >
              {copiedStatus[`output-${index}`] || 'Copy'}
            </button>
          </p>
          <pre>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                math: ({ value }) => <BlockMath>{value}</BlockMath>,
                inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
              }}
            >
              {sample.output}
            </ReactMarkdown>
          </pre>
          {sample.description && (
            <p><strong>Explanation:</strong></p>
          )}
          {sample.description &&
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                math: ({ value }) => <BlockMath>{value}</BlockMath>,
                inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
              }}
            >
              {sample.description}
            </ReactMarkdown>
          }
        </div>
      ))}
    </div>
  );
}

export default SampleCases;