import React from 'react';
import './index.css';
import './light.css';
import './dark.css';

function ContestNotRegistered({ contest, contestId, handleRegister }) {
  return (
    <div className="contest-not-registered-container">
      <h2 className="contest-not-registered-title">{contest.name} ({contestId}) 🏆</h2>
      <div className="contest-not-registered-content">
        <p>You are not registered for this contest.</p>
        <button onClick={handleRegister} className="contest-not-registered-link-button contest-not-registered-register-button">
          Register for Contest 📝
        </button>
      </div>
    </div>
  );
}

export default ContestNotRegistered;
