import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './index.css'; // Import the CSS file

function ProblemSubmissions({ token }) {
  const { problemId } = useParams();
  const [allSubmissions, setAllSubmissions] = useState([]); // Store all fetched submissions
  const [submissions, setSubmissions] = useState([]); // Submissions to display after filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterUserId, setFilterUserId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/problems/${problemId}/submissions`, {
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

    if (problemId && token) {
      fetchSubmissions();
    }
  }, [problemId, token]);

  useEffect(() => {
    let filtered = allSubmissions;

    if (filterUserId) {
      filtered = filtered.filter(submission =>
        submission.user_id.toLowerCase().includes(filterUserId.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(submission =>
        submission.status.toLowerCase() === filterStatus.toLowerCase()
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
  }, [allSubmissions, filterUserId, filterStatus, filterStartDate, filterEndDate]);

  if (loading) {
    return <div className="problem-submissions-loading">Loading submissions...</div>;
  }

  if (error) {
    return <div className="problem-submissions-error">Error: {error.message}</div>;
  }

  // Extract unique statuses and languages for filter options
  const statuses = [...new Set(allSubmissions.map(s => s.status))];
  // const languages = [...new Set(allSubmissions.map(s => s.language))];

  return (
    <div className="problem-submissions-container">
      <h2>Submissions for Problem: {problemId}</h2>
      <div className="problem-submissions-filters">
        <input
          type="text"
          placeholder="Filter by User ID..."
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          className="problem-submissions-filter-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="problem-submissions-filter-select"
        >
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {/* <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="problem-submissions-filter-select"
        >
          <option value="">All Languages</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select> */}
        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="problem-submissions-filter-input"
          title="Filter by Start Date"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="problem-submissions-filter-input"
          title="Filter by End Date"
        />
      </div>
      {submissions.length === 0 ? (
        <div className="problem-submissions-no-submissions">No submissions found for this problem.</div>
      ) : (
        <ul className="problem-submissions-list">
          {submissions.map(submission => (
            <li key={submission.submission_id} className="problem-submissions-list-item">
              <Link to={`/submissions/${submission.submission_id}`}>
                <p><strong>Submission ID:</strong> {submission.submission_id}</p>
                <p><strong>User ID:</strong> {submission.user_id}</p>
                <p><strong>Status:</strong> {submission.status}</p>
                {/* <p><strong>Language:</strong> {submission.language}</p> */}
                <p><strong>Timestamp:</strong> {new Date(submission.timestamp).toLocaleString()}</p>
                {submission.test_results && (
                  <p>
                    <strong>Test Results:</strong> {submission.test_results.filter(tr => tr.status === 'passed').length} / {submission.test_results.length} passed
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
)}

export default ProblemSubmissions;
