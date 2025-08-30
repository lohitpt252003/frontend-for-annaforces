


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function UserSubmissions({ token }) {
  const { userId } = useParams();
  const [allSubmissions, setAllSubmissions] = useState([]); // Store all fetched submissions
  const [submissions, setSubmissions] = useState([]); // Submissions to display after filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterProblemId, setFilterProblemId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

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
        setAllSubmissions(data); // Store all submissions
        setSubmissions(data);    // Initially display all submissions
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

  useEffect(() => {
    let filtered = allSubmissions;

    if (filterProblemId) {
      filtered = filtered.filter(submission =>
        submission.problem_id.toLowerCase().includes(filterProblemId.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(submission =>
        submission.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (filterLanguage) {
      filtered = filtered.filter(submission =>
        submission.language.toLowerCase() === filterLanguage.toLowerCase()
      );
    }

    if (filterStartDate) {
      const start = new Date(filterStartDate).getTime();
      filtered = filtered.filter(submission =>
        new Date(submission.timestamp).getTime() >= start
      );
    }

    if (filterEndDate) {
      const end = new Date(filterEndDate).getTime();
      filtered = filtered.filter(submission =>
        new Date(submission.timestamp).getTime() <= end
      );
    }

    setSubmissions(filtered);
  }, [allSubmissions, filterProblemId, filterStatus, filterLanguage, filterStartDate, filterEndDate]);

  if (loading) {
    return <div className="user-submissions-loading">Loading submissions...</div>;
  }

  if (error) {
    return <div className="user-submissions-error">Error: {error.message}</div>;
  }

  if (submissions.length === 0) {
    return <div className="user-submissions-no-submissions">No submissions found for this user.</div>;
  }

  return (
    <div className="user-submissions-container">
      <h2>Submissions for User: {userId}</h2>

      <div className="user-submissions-filters">
        <input
          type="text"
          placeholder="Filter by Problem ID"
          value={filterProblemId}
          onChange={(e) => setFilterProblemId(e.target.value)}
          className="user-submissions-filter-input"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="user-submissions-filter-select">
          <option value="">All Statuses</option>
          <option value="Accepted">Accepted</option>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Time Limit Exceeded">Time Limit Exceeded</option>
          <option value="Runtime Error">Runtime Error</option>
          <option value="Compilation Error">Compilation Error</option>
        </select>
        <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="user-submissions-filter-select">
          <option value="">All Languages</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
        </select>
        <input
          type="date"
          placeholder="Start Date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="user-submissions-filter-input"
        />
        <input
          type="date"
          placeholder="End Date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="user-submissions-filter-input"
        />
      </div>

      <ul className="user-submissions-list">
        {submissions.map(submission => (
          <li key={submission.submission_id} className="user-submissions-list-item">
            <Link to={`/submissions/${submission.submission_id}`}>
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



