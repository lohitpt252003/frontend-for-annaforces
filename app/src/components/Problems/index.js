import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility
import { getCachedProblems, cacheProblems, clearProblemsCache } from '../../components/cache/problems_list';

function Problems() { // Accept setIsLoading prop
  const [allProblems, setAllProblems] = useState({}); // Store all fetched problems
  const [problems, setProblems] = useState({}); // Problems to display after filtering/searching
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(3);
  const [totalProblems, setTotalProblems] = useState(0);

  const handleClearCache = () => {
    clearProblemsCache();
    window.location.reload();
  };

  useEffect(() => {
    const fetchAllProblemsForFiltering = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      const cachedAllProblems = getCachedProblems();
      if (cachedAllProblems && cachedAllProblems.allProblems) {
        setAllProblems(cachedAllProblems.allProblems);
        setTotalProblems(cachedAllProblems.total_problems_all);
        setIsCached(true);
      } else {
        try {
          // Fetch all problems for filtering purposes (without pagination)
          const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/?per_page=9999`, token); // Fetch a large number to get all
          if (!response) return;
          const data = await response.json();
          if (response.ok) {
            setAllProblems(data.problems);
            setTotalProblems(data.total_problems);
            cacheProblems({ allProblems: data.problems, total_problems_all: data.total_problems });
          } else {
            setError(data.error || 'Failed to fetch all problems for filtering');
          }
        } catch (err) {
          setError('Network error or server is unreachable');
          console.error('Fetch all problems error:', err);
        }
      }
    };

    fetchAllProblemsForFiltering();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchPaginatedProblems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      setIsLoadingLocal(true);
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/problems/?page=${currentPage}&per_page=${problemsPerPage}` +
          `&search=${searchTerm}&difficulty=${filterDifficulty}&tag=${filterTag}`,
          token
        );

        if (!response) return;
        const data = await response.json();

        if (response.ok) {
          setProblems(data.problems);
          setTotalProblems(data.total_problems);
        } else {
          setError(data.error || 'Failed to fetch paginated problems');
        }
      } catch (err) {
        setError('Network error or server is unreachable');
        console.error('Fetch paginated problems error:', err);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    fetchPaginatedProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, problemsPerPage, searchTerm, filterDifficulty, filterTag]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <div className="problems-error">Error: {error}</div>;
  }

  // Extract unique difficulties and tags for filter options
  const difficulties = allProblems ? [...new Set(Object.values(allProblems).map(p => p.difficulty))] : [];
  const tags = allProblems ? [...new Set(Object.values(allProblems).flatMap(p => p.tags))] : [];

  return (
    <div className="problems-container">
      <h2>Problems 📋</h2>
      {isCached && (
        <div className="cache-notification">
          <p>This list is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
        </div>
      )}
      <div className="problems-filters">
        <input
          type="text"
          placeholder="Search by title or ID... 🔍"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="problems-filter-input"
        />
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="problems-filter-select"
        >
          <option value="">All Difficulties 📈</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="problems-filter-select"
        >
          <option value="">All Tags 🏷️</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {isLoadingLocal ? (
        <p className="problems-loading">Loading problems...</p>
      ) : Object.keys(problems).length === 0 ? (
        <p className="problems-no-problems">No problems available.</p>
      ) : (
        <>
          <ul className="problems-list">
            {Object.entries(problems).map(([problemId, problemData]) => (
              <li key={problemId} className="problems-list-item">
                <Link to={`/problems/${problemId}`} className="problems-list-item-link">
                  <h3>{problemData.title} ({problemId})</h3>
                </Link>
                <Link to={`/problems/${problemId}/submissions`} className="problems-view-submissions-link">
                  View Submissions
                </Link>
                <Link to={`/problems/${problemId}/solution`} className="problems-view-solution-link">
                  View Solution
                </Link>
                <p><strong>Difficulty:</strong> ⭐ {problemData.difficulty}</p>
                <p><strong>Tags:</strong> 🏷️ {problemData.tags.join(', ')}</p>
                <p><strong>Authors:</strong> ✍️ {problemData.authors.join(', ')}</p>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: Math.ceil(totalProblems / problemsPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Problems;