import React from 'react';

function WelcomePage({ userName }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Welcome, {userName}!</h2>
      <p>You are now logged in to Annaforces.</p>
    </div>
  );
}

export default WelcomePage;