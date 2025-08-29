import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
        const response = await fetch('http://localhost:5000/api/problems/', {
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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading problems...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  // Extract unique difficulties and tags for filter options
  const difficulties = [...new Set(Object.values(allProblems).map(p => p.difficulty))];
  const tags = [...new Set(Object.values(allProblems).flatMap(p => p.tags))];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Problems</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by title or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }}
        />
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">All Difficulties</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">All Tags</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
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