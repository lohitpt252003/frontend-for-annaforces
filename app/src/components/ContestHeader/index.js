import React from 'react';
import './index.css';
import './light.css';
import './dark.css';

function ContestHeader({ contest, contestId, isCached, handleClearCache, status, timeInfo, progress, isRegistered, handleRegister }) {
  return (
    <div className="contest-header-container">
      <h2 className="contest-header-title">{contest.name} ({contestId}) 🏆</h2>
      {isCached && (
        <div className="cache-notification">
          <p>This contest is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
        </div>
      )}
      <div className="contest-header-content">
        <div className="contest-header-info">
          <p><strong>Status:</strong> {status}</p>
          {timeInfo && <p>{timeInfo}</p>}
          {status === "Running 🚀" && (
            <div className="contest-progress-bar-container">
              <div className="contest-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          {contest.is_practice && <p><strong>Type:</strong> Practice Contest ✅</p>}
          <p><strong>Authors:</strong> ✍️ {contest.authors.join(', ')}</p>
          <p><strong>Start Time:</strong> 🗓️ {new Date(contest.startTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> 🏁 {new Date(contest.endTime).toLocaleString()}</p>
        </div>
        <div className="contest-header-actions">
          {isRegistered ? (
            <p style={{ color: 'green', fontWeight: 'bold', marginRight: '10px' }}>Registered ✅</p>
          ) : (status !== "Over 🏁" && (
            <button onClick={handleRegister} className="contest-header-link-button contest-header-register-button">
              Register for Contest 📝
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContestHeader;
