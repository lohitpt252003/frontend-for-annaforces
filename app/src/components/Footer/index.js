import React from 'react';
import './index.css';
import './light.css';
import './dark.css';

function Footer() {
  return (
    <footer className="footer-container">
      <p>&copy; 2025 Annaforces. All rights reserved.</p>
      <div className="footer-links">
        <a href="/about" className="footer-link">About Us ℹ️</a>
        <a href="/contact" className="footer-link">Contact ✉️</a>
        <a href="/privacy" className="footer-link">Privacy Policy 🔒</a>
      </div>
    </footer>
  );
}

export default Footer;