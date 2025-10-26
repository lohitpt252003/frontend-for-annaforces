import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility

import ProblemCard from '../../components/ProblemCard';
import ProblemFilter from '../../components/ProblemFilter'; // Import ProblemFilter

function Problems() {
  const [problems, setProblems] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        let url = `${process.env.REACT_APP_API_BASE_URL}/api/problems/`;
        const queryParams = [];

        if (filterTitle) {
          queryParams.push(`search=${encodeURIComponent(filterTitle)}`);
        }
        if (filterDifficulty) {
          queryParams.push(`difficulty=${encodeURIComponent(filterDifficulty)}`);
        }
        if (filterTag) {
          queryParams.push(`tag=${encodeURIComponent(filterTag)}`);
        }

        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }

        const problemsData = await api.get(url, token);

        if (problemsData && problemsData.problems) {
          setProblems(problemsData.problems);

          const tags = new Set();
          Object.values(problemsData.problems).forEach(problem => {
            problem.tags.forEach(tag => tags.add(tag));
          });
          setAllTags(Array.from(tags).sort());

        } else {
          setError(problemsData.error || 'Failed to fetch problems');
        }
      } catch (err) {
        setError(err.message || 'Network error or server is unreachable');
        console.error('Fetch problems error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [filterTitle, filterDifficulty, filterTag]);

  if (isLoading) {
    return <p className="problems-loading">Loading problems...</p>;
  }

  if (error) {
    return <div className="problems-error">Error: {error}</div>;
  }

  return (
    <div className="problems-container">
      <h2>Problems 📋</h2>
      <ProblemFilter
        filterTitle={filterTitle}
        setFilterTitle={setFilterTitle}
        filterDifficulty={filterDifficulty}
        setFilterDifficulty={setFilterDifficulty}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        allTags={allTags}
      />
      {Object.keys(problems).length === 0 ? (
        <p className="problems-no-problems">No problems available.</p>
      ) : (
        <div className="problem-card-container">
          {Object.entries(problems).map(([problemId, problemData]) => (
            <ProblemCard
              key={problemId}
              problem={{ id: problemId, meta: problemData }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Problems;