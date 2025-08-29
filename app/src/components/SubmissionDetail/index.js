import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SubmissionDetail({ token }) {
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/submissions/${submissionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubmissionData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (submissionId && token) {
      fetchSubmissionData();
    }
  }, [submissionId, token]);

  if (loading) {
    return <div>Loading submission details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!submissionData) {
    return <div>No submission data found.</div>;
  }

  return (
    <div className="submission-detail-container">
      <h2>Submission Details: {submissionId}</h2>
      <p><strong>Problem ID:</strong> {submissionData.problem_id}</p>
      <p><strong>User ID:</strong> {submissionData.user_id}</p>
      <p><strong>Language:</strong> {submissionData.language}</p>
      <p><strong>Status:</strong> {submissionData.status}</p>
      <p><strong>Timestamp:</strong> {new Date(submissionData.timestamp).toLocaleString()}</p>

      <h3>Code:</h3>
      <pre style={{ backgroundColor: '#eee', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
        <code>{submissionData.code}</code>
      </pre>

      <h3>Test Results:</h3>
      {submissionData.test_results && submissionData.test_results.length > 0 ? (
        <ul>
          {submissionData.test_results.map((testResult, index) => (
            <li key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
              <p><strong>Test Case {testResult.test_case_number}:</strong> {testResult.status}</p>
              <p><strong>Message:</strong> {testResult.message}</p>
              <p><strong>Execution Time:</strong> {testResult.execution_time} s</p>
              <p><strong>Memory Usage:</strong> {testResult.memory_usage} MB</p>
              <p><strong>Expected Output:</strong> <pre>{testResult.expected_output}</pre></p>
              <p><strong>Actual Output:</strong> <pre>{testResult.actual_output}</pre></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No test results available.</p>
      )}
    </div>
  );
}

export default SubmissionDetail;
