import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const ProblemCard = ({ problem }) => {
    if (!problem || !problem.meta) {
        return null; // or a loading indicator
    }

    const { id, meta } = problem;

    // Extract contestId from problem.id (e.g., "C1A" -> "C1")
    const contestIdMatch = id.match(/^(C\d+)/);
    const contestId = contestIdMatch ? contestIdMatch[1] : '';

    return (
        <div className="problem-card">
            <Link to={`/contests/${contestId}/problems/${id}`} className="problem-card-link">
                <h3>{meta.title} ({id})</h3>
            </Link>
            <p><strong>Difficulty:</strong> ⭐ {meta.difficulty}</p>
            <p><strong>Tags:</strong> 🏷️ {meta.tags.join(', ')}</p>
            <p><strong>Authors:</strong> ✍️ {meta.authors.join(', ')}</p>
            <div className="problem-card-actions">
                <Link to={`/contests/${contestId}/problems/${id}/submit`} className="problem-card-button submit-button">
                    Submit Code ✏️
                </Link>
                <Link to={`/contests/${contestId}/problems/${id}/submissions`} className="problem-card-button view-submissions-button">
                    View Submissions 📋
                </Link>
            </div>
        </div>
    );
};

export default ProblemCard;