import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function SubmissionDetail({ token, setIsLoading }) { // Accept setIsLoading prop
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTestCases, setExpandedTestCases] = useState({});

  useEffect(() => {
    const fetchSubmissionData = async () => {
      setIsLoading(true); // Use global loading
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/submissions/${submissionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          if (response.status === 404) {
            setError(new Error("The submission is not there."));
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        const data = await response.json();
        setSubmissionData(data);

        // Initialize all test cases to be expanded by default
        const initialExpandedState = {};
        if (data.test_results) {
          data.test_results.forEach(tr => {
            initialExpandedState[tr.test_case_number] = true;
          });
        }
        setExpandedTestCases(initialExpandedState);

      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false); // Use global loading
      }
    };

    if (submissionId && token) {
      fetchSubmissionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, token]);

  const toggleTestCase = (testCaseNumber) => {
    setExpandedTestCases(prevState => ({
      ...prevState,
      [testCaseNumber]: !prevState[testCaseNumber]
    }));
  };

  if (error) {
    return <div className="submission-detail-error">Error: {error.message}</div>;
  }

  if (!submissionData) {
    return <div className="submission-detail-no-data">No submission data found.</div>;
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
      <pre className="submission-detail-code-block">
        <code>{submissionData.code}</code>
      </pre>

      <h3>Test Results:</h3>
      {submissionData.test_results && submissionData.test_results.length > 0 ? (
        <ul className="submission-detail-test-results-list">
          {submissionData.test_results.map((testResult, index) => (
            <li key={index} className="submission-detail-test-results-list-item">
              <div className="test-case-header">
                <p><strong>Test Case {testResult.test_case_number}:</strong> {testResult.status}</p>
                <button onClick={() => toggleTestCase(testResult.test_case_number)} className="test-case-toggle-button">
                  {expandedTestCases[testResult.test_case_number] ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {expandedTestCases[testResult.test_case_number] && (
                <div className="test-case-details">
                  <p><strong>Message:</strong> {testResult.message}</p>
                  <p><strong>Execution Time:</strong> {testResult.execution_time} s</p>
                  <p><strong>Memory Usage:</strong> {testResult.memory_usage} MB</p>
                  <p><strong>Expected Output:</strong> <pre>{testResult.expected_output}</pre></p>
                  <p><strong>Actual Output:</strong> <pre>{testResult.actual_output}</pre></p>
                </div>
              )}
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