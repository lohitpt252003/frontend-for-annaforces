import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import './light.css';
import './dark.css';

const ContestCard = ({ contest, contestStatus }) => {
    if (!contest || !contestStatus) {
        return null;
    }

    const { id, name, startTime, endTime } = contest;
    const { status, timeInfo, progress } = contestStatus;



    return (
        <div className="contest-card">
            <Link to={`/contests/${id}`} className="contest-card-link">
                <h3>{name} ({id})</h3>
            </Link>
            <p><strong>Status:</strong> {status === 'Upcoming' ? 'Upcoming ⏳' : status === 'Running' ? 'Running 🚀' : 'Over 🏁'}</p>
            {timeInfo && <p>{timeInfo}</p>}
            {status === "Running" && (
                <div className="contest-card-progress-bar-container">
                    <div className="contest-card-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
            )}
            <p><strong>Start Time:</strong> 🗓️ {new Date(startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> 🏁 {new Date(endTime).toLocaleString()}</p>
            <div className="contest-card-actions">
                <Link to={`/contests/${id}`} className="contest-card-button contest-card-view-button">
                    View Contest 🏆
                </Link>
            </div>
        </div>
    );
};

export default ContestCard;
