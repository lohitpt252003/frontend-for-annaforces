import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function ProblemDetail({ setIsLoading }) { // Accept setIsLoading prop
  const { problem_id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      setIsLoading(true); // Use global loading

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problem_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

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
        setIsLoading(false); // Use global loading
      }
    };

    fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem_id]);

  if (error) {
    return <div className="problem-detail-error">Error: {error}</div>;
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
      <div className="problem-detail-statement">
        <ReactMarkdown>{problem.problem_statement}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ProblemDetail;