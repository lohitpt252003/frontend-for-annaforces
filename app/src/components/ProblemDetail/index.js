import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex'; // Import KaTeX components
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import SampleCases from '../SampleCases';
import api from '../../utils/api'; // Import the new api utility

function ProblemDetail() { // Accept setIsLoading prop
  const { problem_id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      setIsLoadingLocal(true); // Use local loading

      try {
        const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problem_id}`, token);

        if (!response) { // If response is null, it means handleApiResponse redirected
          return;
        }

        const data = await response.json();

        if (response.ok) {
          setProblem(data);
        } else {
          if (response.status === 404) {
            setError("The problem is not there.");
          } else {
            setError(data.error || 'Failed to fetch problem details');
          }
        }
      } catch (err) {
        setError('Network error or server is unreachable');
        console.error('Fetch problem error:', err);
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
        </div>
      </div>
      <hr className="problem-detail-separator" />
      <div className="problem-detail-section">
        <h3>Problem Statement 📝</h3>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            math: ({ value }) => <BlockMath>{value}</BlockMath>,
            inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
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
            }}
          >
            {problem.notes_content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default ProblemDetail;