import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './index.css';
import './light.css';
import './dark.css';

function CodeSubmission() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); // Default language
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please log in to submit code.');
      setIsSubmitting(false);
      return;
    }

    if (!code.trim()) {
      toast.error('Code cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/problems/${problemId}/submit`,
        { code, language },
        token
      );
      toast.success(response.message || 'Submission successful!');
      // Redirect to submission detail page or problem page
      navigate('/submissions/queue');
    } catch (error) {
      toast.error(error.message || 'Failed to submit code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="code-submission-container">
      <h2>Submit Code for Problem {problemId}</h2>
      <form onSubmit={handleSubmit} className="code-submission-form">
        <div className="form-group">
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
            disabled={isSubmitting}
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="code-textarea">Code:</label>
          <textarea
            id="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="15"
            className="code-textarea"
            placeholder="Write your code here..."
            disabled={isSubmitting}
          ></textarea>
        </div>
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Submitting...' : 'Submit Code'}
        </button>
      </form>
    </div>
  );
}

export default CodeSubmission;
