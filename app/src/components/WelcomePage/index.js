import React from 'react';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function WelcomePage({ userName }) {
  return (
    <div className="welcome-container">
      <h2 className="welcome-heading">Welcome, {userName}!</h2>
      <p className="welcome-message">You are now logged in to Annaforces.</p>
    </div>
  );
}

export default WelcomePage;
