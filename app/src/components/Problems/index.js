import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility
import { getCachedProblems, cacheProblems, clearProblemsCache } from '../../components/cache/problems_list';

import ProblemCard from '../../components/ProblemCard';

function Problems() { // Accept setIsLoading prop
  const [allProblems, setAllProblems] = useState({}); // Store all fetched problems
  const [problems, setProblems] = useState({}); // Problems to display after filtering/searching
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [userProblemStatus, setUserProblemStatus] = useState({}); // New state for user problem status

  const handleClearCache = async () => {
    await clearProblemsCache();
    window.location.reload();
  };

      useEffect(() => {
      const fetchProblemsAndStatus = async () => {
        const token = localStorage.getItem('token');
        const loggedUserId = localStorage.getItem('username');
        if (!token || !loggedUserId) {
          setError('No token or user ID found. Please log in.');
          return;
        }
  
        setIsLoadingLocal(true);
  
        const cachedProblems = await getCachedProblems();
        if (cachedProblems) {
          setAllProblems(cachedProblems.allProblems);
          setProblems(cachedProblems.allProblems);
          setIsCached(true);
          // Fetch user problem status even if problems are cached
          try {
            const statusData = await api.get(
              `${process.env.REACT_APP_API_BASE_URL}/api/users/${loggedUserId}/problem-status`,
              token
            );
            if (statusData) {
              setUserProblemStatus(statusData);
            }
          } catch (statusError) {
            console.error("Error fetching user problem status:", statusError);
          }
          setIsLoadingLocal(false);
          return;
        }
  
        try {
          const problemsData = await api.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/problems/`,
            token
          );
  
          if (problemsData && problemsData.problems) {
            setAllProblems(problemsData.problems);
            setProblems(problemsData.problems);
            await cacheProblems({ allProblems: problemsData.problems });

            // Fetch user problem status after problems are fetched
            const statusData = await api.get(
              `${process.env.REACT_APP_API_BASE_URL}/api/users/${loggedUserId}/problem-status`,
              token
            );
            if (statusData) {
              setUserProblemStatus(statusData);
            }

          } else {
            setError(problemsData.error || 'Failed to fetch problems');
          }
        } catch (err) {
          setError(err.message || 'Network error or server is unreachable');
          console.error('Fetch problems error:', err);
        } finally {
          setIsLoadingLocal(false);
        }
      };
  
      fetchProblemsAndStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  useEffect(() => {
    let filtered = allProblems;

    if (searchTerm) {
        filtered = Object.entries(filtered).reduce((acc, [problemId, problemData]) => {
            if (problemId.toLowerCase().includes(searchTerm) || problemData.title.toLowerCase().includes(searchTerm)) {
                acc[problemId] = problemData;
            }
            return acc;
        }, {});
    }

    if (filterDifficulty) {
        filtered = Object.entries(filtered).reduce((acc, [problemId, problemData]) => {
            if (problemData.difficulty.toLowerCase() === filterDifficulty.toLowerCase()) {
                acc[problemId] = problemData;
            }
            return acc;
        }, {});
    }

    if (filterTag) {
        filtered = Object.entries(filtered).reduce((acc, [problemId, problemData]) => {
            if (problemData.tags.map(t => t.toLowerCase()).includes(filterTag.toLowerCase())) {
                acc[problemId] = problemData;
            }
            return acc;
        }, {});
    }

    setProblems(filtered);
}, [allProblems, searchTerm, filterDifficulty, filterTag]);


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
          <div className="problem-card-container">
            {Object.entries(problems).map(([problemId, problemData]) => (
              <ProblemCard
                key={problemId}
                problem={{ id: problemId, meta: problemData }}
                userProblemStatus={userProblemStatus[problemId]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Problems;
