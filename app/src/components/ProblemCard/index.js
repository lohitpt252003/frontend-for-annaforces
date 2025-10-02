import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const ProblemCard = ({ problem, userProblemStatus }) => {
    if (!problem || !problem.meta) {
        return null; // or a loading indicator
    }

    const { id, meta } = problem;

    return (
        <div className="problem-card">
            <Link to={`/problems/${id}`} className="problem-card-link">
                <h3>{meta.title} ({id})</h3>
            </Link>
            <p><strong>Difficulty:</strong> ⭐ {meta.difficulty}</p>
            <p><strong>Tags:</strong> 🏷️ {meta.tags.join(', ')}</p>
            <p><strong>Authors:</strong> ✍️ {meta.authors.join(', ')}</p>
            <p><strong>Status:</strong>
                {userProblemStatus === 'solved' && <span style={{ color: 'green', fontWeight: 'bold' }}> ✅ Solved</span>}
                {userProblemStatus === 'not_solved' && <span style={{ color: 'orange', fontWeight: 'bold' }}> ❌ Not Solved</span>}
                {(!userProblemStatus || userProblemStatus === 'not_attempted') && <span style={{ color: 'gray' }}> ❓ Not Attempted</span>}
            </p>
            <div className="problem-card-actions">
                <Link to={`/problems/${id}/submit`} className="problem-card-button submit-button">
                    Submit Code ✏️
                </Link>
                <Link to={`/problems/${id}/submissions`} className="problem-card-button view-submissions-button">
                    View Submissions 📋
                </Link>
            </div>
        </div>
    );
};

export default ProblemCard;
