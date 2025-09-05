import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';

function ResetPassword({ setIsLoading }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation

  useEffect(() => {
    // Get email from location state if redirected from ForgotPassword
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-password-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully!');
        navigate('/login');
      } else {
        setError(data.error || 'Password reset failed.');
        toast.error(data.error || 'Password reset failed.');
      }
    } catch (err) {
      setError('Network error or server is unreachable');
      toast.error('Network error or server is unreachable');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Your Password 🔒</h2>
      <p className="reset-password-message">Enter your email, OTP, and new password below.</p>
      <form onSubmit={handleSubmit}>
        <div className="reset-password-form-group">
          <label htmlFor="email" className="reset-password-label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="reset-password-input"
            required
            readOnly={!!location.state?.email} // Make email read-only if passed from state
          />
        </div>
        <div className="reset-password-form-group">
          <label htmlFor="otp" className="reset-password-label">OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="reset-password-input"
            required
          />
        </div>
        <div className="reset-password-form-group">
          <label htmlFor="newPassword" className="reset-password-label">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="reset-password-input"
            required
          />
        </div>
        <div className="reset-password-form-group">
          <label htmlFor="confirmPassword" className="reset-password-label">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="reset-password-input"
            required
          />
        </div>
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
        {error && <p className="reset-password-error">{error}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
