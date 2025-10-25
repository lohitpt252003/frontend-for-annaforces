import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';

function SubmissionQueue() {
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubmissionQueue = async () => {
    setIsLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/submissions/queue`, token);
      setQueue(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch submission queue.');
      toast.error(err.message || 'Failed to fetch submission queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionQueue();
  }, []);

  if (isLoading) {
    return <div className="submission-queue-loading">Loading submission queue...</div>;
  }

  if (error) {
    return <div className="submission-queue-error">Error: {error}</div>;
  }

  return (
    <div className="submission-queue-container">
      <h2>Submission Queue</h2>
      {queue.length === 0 ? (
        <p>No submissions in the queue.</p>
      ) : (
        <table className="submission-queue-table">
          <thead>
            <tr>
              <th>Submission ID</th>
              <th>Problem ID</th>
              <th>Username</th>
              <th>Language</th>
              <th>Status</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((submission, index) => (
              <tr key={index}>
                <td>{submission._id}</td>
                <td>{submission.problem_id}</td>
                <td>{submission.username}</td>
                <td>{submission.language}</td>
                <td>{submission.status}</td>
                <td>{new Date(submission.created_at * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SubmissionQueue;
