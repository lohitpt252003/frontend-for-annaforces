import React from 'react';
import Logout from '../Logout';

function Header({ isLoggedIn, userName, onLogout }) {
  return (
    <header>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://via.placeholder.com/30" alt="Logo" style={{ marginRight: '10px' }} />
          <a href="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold', fontSize: '1.2em' }}>ANNAFORCES</a>
        </div>
        <div>
          {isLoggedIn ? (
            <>
              <span>Welcome, {userName}</span>
              <Logout onLogout={onLogout} />
            </>
          ) : (
            <span>Welcome User</span>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;