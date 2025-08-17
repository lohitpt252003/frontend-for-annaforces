import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <header className="hero-section">
                <h1>Welcome to Annaforces</h1>
                <p>Your platform for competitive programming</p>
                <div className="cta-buttons">
                    <Link to="/problems" className="btn btn-primary">View Problems</Link>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                </div>
            </header>

            <section className="features-section">
                <h2>Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Extensive Problemset</h3>
                        <p>A wide variety of problems to challenge and improve your skills.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Real-time Judging</h3>
                        <p>Submit your solutions and get instant feedback from our automated judge.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Compete with Peers</h3>
                        <p>Join contests and see how you rank against other programmers.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
