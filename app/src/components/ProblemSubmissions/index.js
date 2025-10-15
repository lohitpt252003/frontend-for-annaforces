import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility

function ProblemSubmissions() { // Removed token prop
  const { problemId } = useParams();
  const [allSubmissions, setAllSubmissions] = useState([]); // Store all fetched submissions
  const [submissions, setSubmissions] = useState([]); // Submissions to display after filtering
  const [error, setError] = useState(null);
  const [filterUsername, setFilterUsername] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [sortKey, setSortKey] = useState('submission_id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setIsLoadingLocal(false);
        return;
      }

      setIsLoadingLocal(true);
      try {
        const submissionsData = await api.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/problems/${problemId}/submissions`,
          token
        );

        if (!submissionsData) {
          return;
        }

        setAllSubmissions(submissionsData.submissions);
        setSubmissions(submissionsData.submissions);

      } catch (error) {
        if (error.message.includes('500')) {
          setAllSubmissions([]);
          setSubmissions([]);
        } else {
          setError(error);
        }
      } finally {
        setIsLoadingLocal(false);
      }
    };

    if (problemId) {
      fetchSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  useEffect(() => {
    let filtered = allSubmissions;

    if (filterUsername) {
      filtered = filtered.filter(submission =>
        submission.username.toLowerCase().includes(filterUsername.toLowerCase())
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
  }, [allSubmissions, filterUsername, filterStatus, filterStartDate, filterEndDate]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedSubmissions = useMemo(() => {
    if (!submissions || !Array.isArray(submissions)) return [];
    return [...submissions].sort((a, b) => {
      if (sortKey === 'submission_id') {
        const aId = parseInt(a.submission_id.substring(1), 10);
        const bId = parseInt(b.submission_id.substring(1), 10);
        if (sortOrder === 'asc') {
          return aId - bId;
        } else {
          return bId - aId;
        }
      } else {
        // Default string comparison for other columns
        const aValue = a[sortKey] ? a[sortKey].toString() : '';
        const bValue = b[sortKey] ? b[sortKey].toString() : '';
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    });
  }, [submissions, sortKey, sortOrder]);

  if (error) {
    return <div className="problem-submissions-error">Error: {error.message}</div>;
  }

  // Extract unique statuses for filter options
  const statuses = [...new Set(allSubmissions.map(s => s.status))];

  return (
    <div className="problem-submissions-container">
      <h2>Submissions for Problem: {problemId} 📋</h2>
      <div className="problem-submissions-filters">
        <input
          type="text"
          placeholder="Filter by Username... 👤"
          value={filterUsername}
          onChange={(e) => setFilterUsername(e.target.value)}
          className="problem-submissions-filter-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="problem-submissions-filter-select"
        >
          <option value="">All Statuses 📊</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="problem-submissions-filter-input"
          title="Filter by Start Date 📅"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="problem-submissions-filter-input"
          title="Filter by End Date 📅"
        />
      </div>
      {isLoadingLocal ? (
        <div className="problem-submissions-loading">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="problem-submissions-no-submissions">No submissions found for this problem.</div>
      ) : (
        <>
          <table className="problem-submissions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('submission_id')}>
                  Submission ID 📄 {sortKey === 'submission_id' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('username')}>
                  Username 🧑‍💻 {sortKey === 'username' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status 📊 {sortKey === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('language')}>
                  Language 🌐 {sortKey === 'language' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('timestamp')}>
                  Timestamp ⏰ {sortKey === 'timestamp' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSubmissions.map(submission => (
                <tr key={submission.submission_id}>
                  <td>
                    <Link to={`/submissions/${submission.submission_id}`}>{submission.submission_id}</Link>
                  </td>
                  <td>
                    <Link to={`/users/${submission.username}`}>{submission.username}</Link>
                  </td>
                  <td className={`status-${submission.status.toLowerCase().replace(/ /g, '-').replace(/_/g, '-')}`}>
                    {/*console.log('Submission Status:', submission.status)*/}
                    {submission.status}
                  </td>
                  <td>{submission.language}</td>
                  <td>{new Date(submission.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ProblemSubmissions;