import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX components
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import SampleCases from '../SampleCases';
import api from '../../utils/api'; // Import the new api utility
import { getCachedProblemDetail, cacheProblemDetail, clearProblemDetailCache } from '../../components/cache/problem_detail';

function ProblemDetail() { // Accept setIsLoading prop
  const { problem_id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [isCached, setIsCached] = useState(false);

  const handleViewPdf = async () => {
    const token = localStorage.getItem('token');
    try {
      const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problem_id}/statement.pdf`, token);
      if (data.pdf_data) {
        const byteCharacters = atob(data.pdf_data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/pdf'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (err) {
      if (err.message.includes("not found")) {
        toast.error('PDF statement not uploaded yet.');
      } else {
        toast.error('Failed to load PDF statement.');
      }
    }
  };

  const handleClearCache = async () => {
    await clearProblemDetailCache(problem_id);
    window.location.reload();
  };

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      setIsLoadingLocal(true);

      const cachedProblem = await getCachedProblemDetail(problem_id);
      if (cachedProblem) {
        setProblem(cachedProblem);
        setIsCached(true);
        setIsLoadingLocal(false);
        return;
      }

      try {
        const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problem_id}`, token);
        setProblem(data);
        await cacheProblemDetail(problem_id, data);
      } catch (err) {
        if (err.message.includes("404")) {
            setError("The problem is not there.");
        } else {
            setError(err.message || 'Network error or server is unreachable');
        }
      } finally {
        setIsLoadingLocal(false); // Use local loading
      }
    };

    fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem_id]);

  if (error) {
    return <div className="problem-detail-error">Error: {error}</div>;
  }

  if (isLoadingLocal) {
    return <div className="problem-detail-loading">Loading problem details...</div>;
  }

  if (!problem) {
    return <div className="problem-detail-not-found">Problem not found.</div>;
  }

  return (
    <div className="problem-detail-container">
      <h2 className="problem-detail-title">{problem.meta.title} ({problem_id}) 📄</h2>
      {isCached && (
        <div className="cache-notification">
          <p>This problem is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
        </div>
      )}
      <div className="problem-detail-header-content">
        <div className="problem-detail-info">
          <p><strong>Difficulty:</strong> ⭐ {problem.meta.difficulty}</p>
          <p><strong>Tags:</strong> 🏷️ {problem.meta.tags.join(', ')}</p>
          <p><strong>Authors:</strong> ✍️ {problem.meta.authors.join(', ')}</p>
        </div>
        <div className="problem-detail-actions">
          <Link to={`/problems/${problem_id}/submit`} className="problem-detail-link-button problem-detail-submit-button">
            Submit Code ✏️
          </Link>
          <Link to={`/problems/${problem_id}/submissions`} className="problem-detail-link-button problem-detail-view-submissions-button">
            View All Submissions 📋
          </Link>
          <Link to={`/problems/${problem_id}/solution`} className="problem-detail-link-button problem-detail-view-solution-button">
            View Solution 💡
          </Link>
          {problem.has_pdf_statement && (
            <button onClick={handleViewPdf} className="problem-detail-link-button problem-detail-pdf-button">
              View PDF Statement
            </button>
          )}
        </div>
      </div>
      <hr className="problem-detail-separator" />
      <>
        <div className="problem-detail-section">
          <h3>Problem Statement 📝</h3>
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
            {problem.description_content}
          </ReactMarkdown>
        </div>

        <div className="problem-detail-section">
          <h3>Input Format 📥</h3>
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
            {problem.input_content}
          </ReactMarkdown>
        </div>

        <div className="problem-detail-section">
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
            {problem.output_content}
          </ReactMarkdown>
        </div>

        {problem.constraints_content && (
          <div className="problem-detail-section">
            <h3>Constraints 📏</h3>
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
              {problem.constraints_content}
            </ReactMarkdown>
          </div>
        )}

        <SampleCases samples_data={problem.samples_data} />

        {problem.notes_content && (
          <div className="problem-detail-section">
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
              {problem.notes_content}
            </ReactMarkdown>
          </div>
        )}
      </>
    </div>
  );
}

export default ProblemDetail;
