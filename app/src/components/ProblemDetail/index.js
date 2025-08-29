import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProblemDetail() {
  const { problem_id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/problems/${problem_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          // console.log(data);
          
          setProblem(data);
        } else {
          setError(data.error || 'Failed to fetch problem details');
        }
      } catch (err) {
        setError('Network error or server is unreachable');
        console.error('Fetch problem error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problem_id]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading problem details...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  if (!problem) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Problem not found.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{problem.meta.title} ({problem_id})</h2>
      <p><strong>Difficulty:</strong> {problem.meta.difficulty}</p>
      <p><strong>Tags:</strong> {problem.meta.tags.join(', ')}</p>
      <p><strong>Authors:</strong> {problem.meta.authors.join(', ')}</p>
      <Link to={`/problems/${problem_id}/submit`} style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Submit Code
      </Link>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: problem.problem_statement }} />
    </div>
  );
}

export default ProblemDetail;