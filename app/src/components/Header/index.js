import React from 'react';
import Logout from '../Logout';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file

function Header({ isLoggedIn, userName, onLogout }) {
  return (
    <header>
      <nav className="header-nav">
        <div className="header-logo-container">
          <img src="https://raw.githubusercontent.com/lohitpt252003/DATA/refs/heads/main/data/assets/images/logo.png" alt="Logo" className="header-logo-image" />
          <Link to="/" className="header-link-brand">ANNAFORCES</Link>
        </div>
        <div className="header-nav-links">
          {isLoggedIn && (
            <>
              <Link to="/problems" className="header-nav-link">Problems</Link>
              <Link to="/profile" className="header-nav-link">Profile</Link>
              <Link to="/credits" className="header-nav-link">Credits</Link>
            </>
          )}
          {isLoggedIn ? (
            <>
              <Logout onLogout={onLogout} />
            </>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
