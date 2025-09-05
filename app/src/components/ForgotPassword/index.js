import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';

function ForgotPassword({ setIsLoading }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [mode, setMode] = useState(location.state?.mode || 'userid'); // 'userid' or 'password'

  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = mode === 'userid' ? '/api/auth/forgot-userid' : '/api/auth/request-password-reset';
    const successMessage = mode === 'userid' ? 'If a user with that email exists, a reminder has been sent.' : 'If a user with that email exists, an OTP has been sent to your email.';
    const errorMessage = mode === 'userid' ? 'Failed to send reminder.' : 'Failed to send OTP.';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || successMessage);
        if (mode === 'password') {
          navigate('/reset-password', { state: { email: email } }); // Redirect to reset password page with email
        }
      } else {
        setError(data.error || errorMessage);
        toast.error(data.error || errorMessage);
      }
    } catch (err) {
      setError('Network error or server is unreachable');
      toast.error('Network error or server is unreachable');
      console.error(`Forgot ${mode} error:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Forgot Your {mode === 'userid' ? 'User ID' : 'Password'}? 🤔</h2>
      <p className="forgot-password-message">
        Enter your email address below, and if it matches our records, we will send you your {mode === 'userid' ? 'User ID and username' : 'password reset OTP'}.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="forgot-password-form-group">
          <label htmlFor="email" className="forgot-password-label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-password-input"
            required
          />
        </div>
        <button type="submit" className="forgot-password-button">
          Send {mode === 'userid' ? 'User ID Reminder' : 'Password Reset OTP'}
        </button>
        {error && <p className="forgot-password-error">{error}</p>}
      </form>
      <div className="forgot-password-toggle-mode">
        {mode === 'userid' ? (
          <p>Remembered your password? <span onClick={() => setMode('password')} className="forgot-password-toggle-link">Reset Password</span></p>
        ) : (
          <p>Need your User ID? <span onClick={() => setMode('userid')} className="forgot-password-toggle-link">Get User ID</span></p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
