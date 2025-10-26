import React from 'react';
import './index.css';
import './light.css';
import './dark.css';

function ContestTabs({ activeTab, setActiveTab }) {
  return (
    <div className="contest-tabs-container">
      <button
        className={`contest-tabs-button ${activeTab === 'problems' ? 'active' : ''}`}
        onClick={() => setActiveTab('problems')}
      >
        Problems 🧩
      </button>
      <button
        className={`contest-tabs-button ${activeTab === 'description' ? 'active' : ''}`}
        onClick={() => setActiveTab('description')}
      >
        Description 📝
      </button>
      <button
        className={`contest-tabs-button ${activeTab === 'theory' ? 'active' : ''}`}
        onClick={() => setActiveTab('theory')}
      >
        Theory 🧠
      </button>
    </div>
  );
}

export default ContestTabs;
