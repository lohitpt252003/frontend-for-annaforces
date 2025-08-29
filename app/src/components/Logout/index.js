import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogoutClick} style={{ marginLeft: '15px', padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      Logout
    </button>
  );
}

export default Logout;