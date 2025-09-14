import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import OTPVerification from './components/OTPVerification';
import WelcomePage from './components/WelcomePage';
import Problems from './components/Problems';
import ProblemDetail from './components/ProblemDetail';
import Profile from './components/Profile';
import UserSubmissions from './components/UserSubmissions';
import SubmissionDetail from './components/SubmissionDetail';
import CodeSubmission from './components/CodeSubmission';
import ProblemSubmissions from './components/ProblemSubmissions';
import SolutionDetail from './components/SolutionDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Credits from './components/Credits';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFound';
import LoadingSpinner from './components/LoadingSpinner'; // Import LoadingSpinner
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import themeData from './assets/theme.json';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for global loading
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.className = theme + '-theme';
    localStorage.setItem('theme', theme);
  }, [theme]);

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
    toast.success('Logged out successfully!');
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} userName={userName} userId={userId} onLogout={handleLogout} toggleTheme={toggleTheme} currentTheme={theme} />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLoginSuccess} setIsLoading={setIsLoading} />} />
          <Route path="/signup" element={<Signup setIsLoading={setIsLoading} />} />
          <Route path="/verify-otp/:email" element={<OTPVerification setIsLoading={setIsLoading} />} />
          <Route path="/forgot-password" element={<ForgotPassword setIsLoading={setIsLoading} />} />
          <Route path="/reset-password" element={<ResetPassword setIsLoading={setIsLoading} />} />
          
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/welcome" element={<WelcomePage userName={userName} />} />
            <Route path="/problems" element={<Problems userId={userId} token={token} setIsLoading={setIsLoading} />} />
            <Route path="/problems/:problem_id" element={<ProblemDetail userId={userId} token={token} setIsLoading={setIsLoading} />} />
            <Route path="/problems/:problemId/submit" element={<CodeSubmission token={token} setIsLoading={setIsLoading} />} />
            <Route path="/problems/:problemId/submissions" element={<ProblemSubmissions token={token} setIsLoading={setIsLoading} />} />
            <Route path="/problems/:problemId/solution" element={<SolutionDetail setGlobalLoading={setIsLoading} />} />
            <Route path="/users/:userId" element={<Profile loggedUserId={userId} token={token} setIsLoading={setIsLoading} />} />
            <Route path="/users/:userId/submissions" element={<UserSubmissions token={token} setIsLoading={setIsLoading} />} />
            <Route path="/submissions/:submissionId" element={<SubmissionDetail token={token} setIsLoading={setIsLoading} />} />
            <Route path="/credits" element={<Credits />} />
          </Route>

          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          <Route path="/" element={isLoggedIn ? <Navigate to="/welcome" /> : <Navigate to="/login" />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
        <Footer />
        <LoadingSpinner loading={isLoading} /> {/* Render LoadingSpinner */}
      </div>
    </Router>
  );
}

export default App;
