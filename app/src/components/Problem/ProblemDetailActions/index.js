import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import './light.css';
import './dark.css';

function ProblemDetailActions({ problem_id, problem, handleViewPdf, isPdfLoading }) {
  return (
    <div className="problem-detail-actions">
      <Link to={`/problems/${problem_id}/submit`} className="problem-detail-link-button problem-detail-submit-button">
        Submit Code ✏️
      </Link>
      <Link to={`/problems/${problem_id}/submissions`} className="problem-detail-link-button problem-detail-view-submissions-button">
        View All Submissions 📋
      </Link>
      <Link to={`/problems/${problem_id}/solution`} className="problem-detail-link-button problem-detail-view-solution-button">
        View Solution 💡
      </Link>
      {problem && problem.has_pdf_statement && (
        <button onClick={handleViewPdf} className="problem-detail-link-button problem-detail-pdf-button" disabled={isPdfLoading}>
          {isPdfLoading ? (
            <>
              <span className="spinner" /> Loading...
            </>
          ) : (
            'View PDF Statement'
          )}
        </button>
      )}
    </div>
  );
}

export default ProblemDetailActions;
