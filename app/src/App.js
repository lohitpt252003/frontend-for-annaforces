import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedUserName = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');

    if (storedUserId && storedUserName && storedToken) {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (newUserId, newUserName, newName, newToken) => {
    setUserId(newUserId);
    setUserName(newUserName);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName('');
    setUserId('');
    setToken('');
  };

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/welcome" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/welcome" element={isLoggedIn ? <WelcomePage userName={userName} /> : <Navigate to="/login" />} />
          <Route path="/" element={isLoggedIn ? <Navigate to="/welcome" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;