import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function CodeSubmission({ token, setIsLoading }) { // Accept setIsLoading prop
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); // Default language
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true); // Use global loading

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${problemId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, language })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setMessage(data.message || 'Submission successful!');
      toast.success(data.message || 'Submission successful!');
      // Optionally navigate to submission details or user submissions page
      if (data.submission_id) {
        navigate(`/submissions/${data.submission_id}`);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false); // Use global loading
    }
  };

  return (
    <div className="code-submission-container">
      <h2>Submit Code for Problem: {problemId} ⌨️</h2>
      <form onSubmit={handleSubmit} className="code-submission-form">
        <div className="code-submission-form-group">
          <label htmlFor="language" className="code-submission-label">Language: 🌐</label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="code-submission-select">
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="code-submission-form-group">
          <label htmlFor="code" className="code-submission-label">Code: 💻</label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="20"
            cols="80"
            placeholder="Write your code here..."
            className="code-submission-textarea"
          ></textarea>
        </div>
        <button type="submit" className="code-submission-button">Submit 🚀</button>
      </form>

      {message && <p className="code-submission-message success">{message}</p>}
      {error && <p className="code-submission-message error">{error}</p>}
    </div>
  );
}

export default CodeSubmission;