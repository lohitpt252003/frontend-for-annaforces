import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import './light.css';
import './dark.css';

const ContestCard = ({ contest, contestStatus, isRegistered, onRegister }) => {
    if (!contest || !contestStatus) {
        return null;
    }

    const { id, name, startTime, endTime } = contest;
    const { status, timeInfo, progress } = contestStatus;

    const canRegister = (status === "Upcoming ⏳" || status === "Running 🚀") && !isRegistered;

    return (
        <div className="contest-card">
            <Link to={`/contests/${id}`} className="contest-card-link">
                <h3>{name} ({id})</h3>
            </Link>
            <p><strong>Status:</strong> {status}</p>
            {timeInfo && <p>{timeInfo}</p>}
            {status === "Running 🚀" && (
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
                {isRegistered ? (
                    <p className="contest-card-registered-status">Registered ✅</p>
                ) : canRegister ? (
                    <button onClick={() => onRegister(id)} className="contest-card-button contest-card-register-button">Register 📝</button>
                ) : null}
            </div>
        </div>
    );
};

export default ContestCard;
