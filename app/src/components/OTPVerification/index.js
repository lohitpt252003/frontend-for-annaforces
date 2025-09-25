import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';

import api from '../../utils/api'; // Import the new api utility

function OTPVerification({ setIsLoading }) {
  const { email } = useParams();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp`, { email, otp });

      if (data) {
        toast.success(data.message || 'OTP verified successfully! You can now login.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <h2 className="otp-verification-title">Verify Your Email 📧</h2>
      <p className="otp-verification-message">An OTP has been sent to your registered email address. Please enter it below to verify your account.</p>
      <form onSubmit={handleSubmit}>
        <div className="otp-verification-form-group">
          <label htmlFor="otp" className="otp-verification-label">OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-verification-input"
            required
            maxLength="6"
          />
        </div>
        <button type="submit" className="otp-verification-button">
          Verify OTP
        </button>
        {error && <p className="otp-verification-error">{error}</p>}
      </form>
      {/* You can add a resend OTP button here if needed */}
    </div>
  );
}

export default OTPVerification;