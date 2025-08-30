


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function Problems() {
  const [allProblems, setAllProblems] = useState({}); // Store all fetched problems
  const [problems, setProblems] = useState({}); // Problems to display after filtering/searching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/problems/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setAllProblems(data); // Store all problems
          setProblems(data);    // Initially display all problems
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

  useEffect(() => {
    // Apply filters and search whenever allProblems, searchTerm, or filters change
    let filtered = Object.entries(allProblems);

    if (searchTerm) {
      filtered = filtered.filter(([problemId, problemData]) =>
        problemData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problemId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDifficulty) {
      filtered = filtered.filter(([problemId, problemData]) =>
        problemData.difficulty.toLowerCase() === filterDifficulty.toLowerCase()
      );
    }

    if (filterTag) {
      filtered = filtered.filter(([problemId, problemData]) =>
        problemData.tags.some(tag => tag.toLowerCase() === filterTag.toLowerCase())
      );
    }

    setProblems(Object.fromEntries(filtered));
  }, [allProblems, searchTerm, filterDifficulty, filterTag]);

  if (loading) {
    return <div className="problems-loading">Loading problems...</div>;
  }

  if (error) {
    return <div className="problems-error">Error: {error}</div>;
  }

  // Extract unique difficulties and tags for filter options
  const difficulties = [...new Set(Object.values(allProblems).map(p => p.difficulty))];
  const tags = [...new Set(Object.values(allProblems).flatMap(p => p.tags))];

  return (
    <div className="problems-container">
      <h2>Problems</h2>
      <div className="problems-filters">
        <input
          type="text"
          placeholder="Search by title or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="problems-filter-input"
        />
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="problems-filter-select"
        >
          <option value="">All Difficulties</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="problems-filter-select"
        >
          <option value="">All Tags</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {Object.keys(problems).length === 0 ? (
        <p className="problems-no-problems">No problems available.</p>
      ) : (
        <ul className="problems-list">
          {Object.entries(problems).map(([problemId, problemData]) => (
            <li key={problemId} className="problems-list-item">
              <Link to={`/problems/${problemId}`} className="problems-list-item-link">
                <h3>{problemData.title} ({problemId})</h3>
              </Link>
              <Link to={`/problems/${problemId}/submissions`} className="problems-view-submissions-link">
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


