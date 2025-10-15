import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility

function Login({ onLogin }) { // Add setIsLoading prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoadingLocal(true); // Use local loading

    try {
      const data = await api.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { username: username, password: password });

      if (!data) { // If data is null, it means handleApiResponse redirected
        return;
      }

      if (data) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('name', data.name);
        localStorage.setItem('token', data.token);

        onLogin(data.username, data.name, data.token);
        toast.success('Login successful!');
        navigate('/welcome');
      } else {
        setError(data.error || 'Login failed');
        toast.error(data.error || 'Login failed');
        if (data.error === "Account not verified. Please verify your email with OTP.") {
          navigate(`/verify-otp/${username}`);
        }
      }
    } catch (err) {
      setError('Network error or server is unreachable');
      toast.error('Network error or server is unreachable');
      console.error('Login error:', err);
    } finally {
      setIsLoadingLocal(false); // Use local loading
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login 🔑</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="username" className="login-label">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password" className="login-label">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={isLoadingLocal}>
          {isLoadingLocal ? 'Logging in...' : 'Login ▶️'}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
      <p className="login-signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <p className="login-forgot-password-link">
        <Link to="/forgot-password">Forgot Username / Password?</Link>
      </p>
    </div>
  );
}

export default Login;