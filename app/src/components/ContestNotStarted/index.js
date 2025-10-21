import React from 'react';
import './index.css';
import './light.css';
import './dark.css';

function ContestNotStarted({ contest, contestId, timeInfo }) {
  return (
    <div className="contest-not-started-container">
      <h2 className="contest-not-started-title">{contest.name} ({contestId}) 🏆</h2>
      <div className="contest-not-started-content">
        <p>The contest has not begun yet.</p>
        <p>{timeInfo}</p>
      </div>
    </div>
  );
}

export default ContestNotStarted;
