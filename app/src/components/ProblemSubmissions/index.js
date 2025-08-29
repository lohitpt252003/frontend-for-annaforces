import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProblemSubmissions = () => {
  const { problem_id } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios.get(`/api/problems/${problem_id}/submissions`)
      .then(response => {
        setSubmissions(response.data);
      })
      .catch(error => {
        console.error(`Error fetching submissions for problem ${problem_id}:`, error);
      });
  }, [problem_id]);

  return (
    <div>
      <h2>Submissions for Problem {problem_id}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Submission ID</th>
            <th>User ID</th>
            <th>Status</th>
            <th>Language</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => (
            <tr key={submission.submission_id}>
              <td>{submission.submission_id}</td>
              <td>{submission.user_id}</td>
              <td>{submission.status}</td>
              <td>{submission.language}</td>
              <td>{submission.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemSubmissions;