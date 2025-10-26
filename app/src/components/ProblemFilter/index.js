import React from 'react';
import './index.css';
import './light.css';
import './dark.css';

function ProblemFilter({
  filterTitle,
  setFilterTitle,
  filterDifficulty,
  setFilterDifficulty,
  filterTag,
  setFilterTag,
  allTags,
}) {
  return (
    <div className="problem-filter-container">
      <input
        type="text"
        placeholder="Search by title or ID... 🔍"
        value={filterTitle}
        onChange={(e) => setFilterTitle(e.target.value)}
        className="problem-filter-input"
      />
      <select
        value={filterDifficulty}
        onChange={(e) => setFilterDifficulty(e.target.value)}
        className="problem-filter-select"
      >
        <option value="">All Difficulties 🌟</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <select
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
        className="problem-filter-select"
      >
        <option value="">All Tags 🏷️</option>
        {allTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
    </div>
  );
}

export default ProblemFilter;