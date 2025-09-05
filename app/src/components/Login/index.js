import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function Login({ onLogin, setIsLoading }) { // Add setIsLoading prop
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Use global loading

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('name', data.name);
        localStorage.setItem('token', data.token);

        onLogin(data.user_id, data.username, data.name, data.token);
        toast.success('Login successful!');
        navigate('/welcome');
      } else {
        setError(data.error || 'Login failed');
        toast.error(data.error || 'Login failed');
        if (data.error === "Account not verified. Please verify your email with OTP.") {
          navigate(`/verify-otp/${userId}`);
        }
      }
    } catch (err) {
      setError('Network error or server is unreachable');
      toast.error('Network error or server is unreachable');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false); // Use global loading
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login 🔑</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="userId" className="login-label">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
        <button type="submit" className="login-button" disabled={false}> {/* Remove disabled based on local isLoading */}
          Login ▶️
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
      <p className="login-signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <p className="login-forgot-password-link">
        <Link to="/forgot-password">Forgot User ID?</Link>
      </p>
      <p className="login-forgot-password-link">
        <Link to={{ pathname: "/forgot-password", state: { mode: "password" } }}>Forgot Password?</Link>
      </p>
    </div>
  );
}

export default Login;