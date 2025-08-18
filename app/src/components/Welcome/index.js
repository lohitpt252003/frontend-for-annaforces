import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const WelcomePage = () => {
    const [userData, setUserData] = useState({ name: '', username: '' });

    useEffect(() => {
        const name = localStorage.getItem('name');
        const username = localStorage.getItem('username');
        if (name && username) {
            setUserData({ name, username });
        }
    }, []);

    return (
        <div className="welcome-page">
            <header className="welcome-header">
                <h1>Welcome, {userData.name}!</h1>
                <p>Logged in as: {userData.username}</p>
            </header>

            <section className="dashboard-section">
                <h2>Your Dashboard</h2>
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>My Profile</h3>
                        <p>View and edit your profile information.</p>
                        <Link to="/profile" className="btn btn-primary">Go to Profile</Link>
                    </div>
                    <div className="dashboard-card">
                        <h3>My Submissions</h3>
                        <p>See your past submissions and their results.</p>
                        <Link to="/submissions" className="btn btn-primary">View Submissions</Link>
                    </div>
                    <div className="dashboard-card">
                        <h3>Start a Contest</h3>
                        <p>Join a new contest and start solving problems.</p>
                        <Link to="/contests" className="btn btn-primary">Find a Contest</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WelcomePage;
