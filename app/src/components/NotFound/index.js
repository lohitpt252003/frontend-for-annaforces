import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import './light.css';
import './dark.css';

function NotFound() {
  const location = useLocation();

  return (
    <div className="not-found-container">
      <h2 className="not-found-title">404 - Page Not Found 😭</h2>
      <p className="not-found-message">The URL <span className="not-found-url">{window.location.href}</span> is not found or is incorrect.</p>
      <p className="not-found-redirect">Go to <Link to="/welcome" className="not-found-link">Welcome Page 🏠</Link>.</p>
    </div>
  );
}

export default NotFound;