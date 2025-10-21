import React from 'react';
import ProblemCard from '../../components/ProblemCard';
import './index.css';
import './light.css';
import './dark.css';

function ContestProblems({ isLoadingContestProblems, contestProblemsDetails, userProblemStatus }) {
  return (
    <div className="contest-problems-section">
      <h3>Problems in this Contest 🧩</h3>
      {isLoadingContestProblems ? (
        <p className="contest-problems-loading">Loading problems...</p>
      ) : Object.keys(contestProblemsDetails).length === 0 ? (
        <p className="contest-problems-no-problems">No problems available for this contest.</p>
      ) : (
        <div className="problem-cards-container">
          {Object.entries(contestProblemsDetails).map(([problemId, problemData]) => (
            <ProblemCard
              key={problemId}
              problem={{ id: problemId, meta: problemData.meta }}
              userProblemStatus={userProblemStatus[problemId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ContestProblems;
