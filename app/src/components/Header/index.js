import React, { useState } from 'react';
import Logout from '../Logout';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function Header({ isLoggedIn, userName, userId, onLogout, toggleTheme, currentTheme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <nav className="header-nav">
        <div className="header-logo-container">
          <img src="https://raw.githubusercontent.com/lohitpt252003/DATA/refs/heads/main/data/assets/images/logo.png" alt="Logo" className="header-logo-image" />
          <Link to="/" className="header-link-brand">ANNAFORCES</Link>
        </div>
        <div className={`header-nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {isLoggedIn && (
            <>
              <Link to="/problems" className="header-nav-link" onClick={toggleMobileMenu}>Problems 🧩</Link>
              <Link to={`/users/${userId}`} className="header-nav-link" onClick={toggleMobileMenu}>Profile 🧑‍💻</Link>
              <Link to="/credits" className="header-nav-link" onClick={toggleMobileMenu}>Credits 🏆</Link>
            </>
          )}
          <button onClick={toggleTheme} className="theme-toggle-button">
            {currentTheme === 'light' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
          </button>
          {isLoggedIn && ( // Only render logout if logged in
            <div className="header-logout-container">
              <Logout onLogout={onLogout} />
            </div>
          )}
        </div>
        <button className="hamburger-menu-button" onClick={toggleMobileMenu}>
          ☰
        </button>
      </nav>
    </header>
  );
}

export default Header;
