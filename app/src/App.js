import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';
import Problems from './components/Problems';
import ProblemDetail from './components/ProblemDetail';
import Profile from './components/Profile';
import UserSubmissions from './components/UserSubmissions';
import SubmissionDetail from './components/SubmissionDetail';
import CodeSubmission from './components/CodeSubmission';
import ProblemSubmissions from './components/ProblemSubmissions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
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
          <Route path="/login" element={isLoggedIn ? <Navigate to="/welcome" /> : <Login onLogin={handleLoginSuccess} />} />
          
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/welcome" element={<WelcomePage userName={userName} />} />
            <Route path="/problems" element={<Problems userId={userId} token={token} />} />
            <Route path="/problems/:problem_id" element={<ProblemDetail userId={userId} token={token} />} />
            <Route path="/problems/:problemId/submit" element={<CodeSubmission token={token} />} />
            <Route path="/problems/:problemId/submissions" element={<ProblemSubmissions token={token} />} />
            <Route path="/profile" element={<Profile userId={userId} token={token} />} />
            <Route path="/users/:userId/submissions" element={<UserSubmissions token={token} />} />
            <Route path="/submissions/:submissionId" element={<SubmissionDetail token={token} />} />
          </Route>

          <Route path="/" element={isLoggedIn ? <Navigate to="/welcome" /> : <Navigate to="/login" />} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;