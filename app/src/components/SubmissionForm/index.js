import React, { useState } from 'react';
import axios from 'axios';

const SubmissionForm = ({ problemId }) => {
  const [userId, setUserId] = useState('');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`/api/problems/${problemId}/submit`, { user_id: userId, language, code })
      .then(response => {
        setMessage(`Submission successful! Status: ${response.data.status}`);
      })
      .catch(error => {
        setMessage(`Error submitting solution: ${error.response.data.error}`);
      });
  };

  return (
    <div>
      <h3>Submit Solution</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input type="text" value={userId} onChange={e => setUserId(e.target.value)} required />
        </div>
        <div>
          <label>Language:</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
          </select>
        </div>
        <div>
          <label>Code:</label>
          <textarea value={code} onChange={e => setCode(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SubmissionForm;
