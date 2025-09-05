import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';

function Signup({ setIsLoading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'OTP sent successfully! Please check your email.');
        navigate(`/verify-otp/${email}`); // Redirect to OTP verification page with email
      } else {
        setError(data.error || 'Signup failed');
        toast.error(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error or server is unreachable');
      toast.error('Network error or server is unreachable');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up 🚀</h2>
      <form onSubmit={handleSubmit}>
        <div className="signup-form-group">
          <label htmlFor="username" className="signup-label">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password" className="signup-label">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="name" className="signup-label">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="email" className="signup-label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        {error && <p className="signup-error">{error}</p>}
      </form>
      <p className="signup-login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;