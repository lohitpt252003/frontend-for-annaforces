import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState({});

  useEffect(() => {
    axios.get('/api/problems')
      .then(response => {
        setProblems(response.data);
      })
      .catch(error => {
        console.error('Error fetching problems:', error);
      });
  }, []);

  return (
    <div>
      <h2>Problems</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(problems).map(problemId => (
            <tr key={problemId}>
              <td>{problemId}</td>
              <td>
                <Link to={`/problems/${problemId}`}>{problems[problemId].title}</Link>
              </td>
              <td>{problems[problemId].difficulty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList;