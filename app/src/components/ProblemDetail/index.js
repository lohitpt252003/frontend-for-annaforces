import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SubmissionForm from '../SubmissionForm';

const ProblemDetail = () => {
  const { problem_id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    axios.get(`/api/problems/${problem_id}`)
      .then(response => {
        setProblem(response.data);
      })
      .catch(error => {
        console.error(`Error fetching problem ${problem_id}:`, error);
      });
  }, [problem_id]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{problem.meta.title}</h2>
      <p>Difficulty: {problem.meta.difficulty}</p>
      <div dangerouslySetInnerHTML={{ __html: problem.problem_statement }} />
      <hr />
      <SubmissionForm problemId={problem_id} />
    </div>
  );
};

export default ProblemDetail;