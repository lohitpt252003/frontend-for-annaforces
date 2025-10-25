import React from 'react';
import './index.css';
import './light.css';
import './dark.css';

function ProblemHeader({ problem, problem_id, isCached, handleClearCache }) {
  return (
    <div className="problem-header-container">
      <h2 className="problem-header-title">{problem && problem.meta && problem.meta.title} ({problem_id}) 📄</h2>
      {isCached && (
        <div className="cache-notification">
          <p>This problem is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
        </div>
      )}
      <div className="problem-header-content">
        <div className="problem-header-info">
          <p><strong>Difficulty:</strong> ⭐ {problem && problem.meta && problem.meta.difficulty}</p>
          <p><strong>Time Limit:</strong> ⏰ {problem && problem.meta && problem.meta.timeLimit} ms</p>
          <p><strong>Memory Limit:</strong> 🧠 {problem && problem.meta && problem.meta.memoryLimit} MB</p>
          <p><strong>Tags:</strong> 🏷️ {problem && problem.meta && problem.meta.tags && problem.meta.tags.join(', ')}</p>
          <p><strong>Authors:</strong> ✍️ {problem && problem.meta && problem.meta.authors && problem.meta.authors.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}

export default ProblemHeader;
