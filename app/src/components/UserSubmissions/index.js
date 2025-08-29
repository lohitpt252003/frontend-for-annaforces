import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function UserSubmissions({ token }) {
  const { userId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/submissions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchSubmissions();
    }
  }, [userId, token]);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (submissions.length === 0) {
    return <div>No submissions found for this user.</div>;
  }

  return (
    <div className="user-submissions-container">
      <h2>Submissions for User: {userId}</h2>
      <ul>
        {submissions.map(submission => (
          <li key={submission.submission_id}>
            <Link to={`/submissions/${submission.submission_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <p><strong>Submission ID:</strong> {submission.submission_id}</p>
              <p><strong>Problem ID:</strong> {submission.problem_id}</p>
              <p><strong>Status:</strong> {submission.status}</p>
              <p><strong>Language:</strong> {submission.language}</p>
              <p><strong>Timestamp:</strong> {new Date(submission.timestamp).toLocaleString()}</p>
              {submission.test_results && (
                <p>
                  <strong>Test Results:</strong> {submission.test_results.filter(tr => tr.status === 'passed').length} / {submission.test_results.length} passed
                </p>
              )}
              {/* Add more submission details as needed */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSubmissions;
