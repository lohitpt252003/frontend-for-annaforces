import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Problems() {
  const [problems, setProblems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/problems/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProblems(data);
        } else {
          setError(data.error || 'Failed to fetch problems');
        }
      } catch (err) {
        setError('Network error or server is unreachable');
        console.error('Fetch problems error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading problems...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Problems</h2>
      {Object.keys(problems).length === 0 ? (
        <p>No problems available.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Object.entries(problems).map(([problemId, problemData]) => (
            <li key={problemId} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '10px' }}>
              <Link to={`/problems/${problemId}`} style={{ textDecoration: 'none', color: 'blue' }}>
                <h3>{problemData.title} ({problemId})</h3>
              </Link>
              <Link to={`/problems/${problemId}/submissions`} style={{ marginLeft: '10px', textDecoration: 'none', color: 'green' }}>
                View Submissions
              </Link>
              <p><strong>Difficulty:</strong> {problemData.difficulty}</p>
              <p><strong>Tags:</strong> {problemData.tags.join(', ')}</p>
              <p><strong>Authors:</strong> {problemData.authors.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Problems;