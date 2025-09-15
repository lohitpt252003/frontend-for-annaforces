import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import { getCachedSubmission, cacheSubmission } from '../cache';

function SubmissionDetail({ token, setIsLoading }) { // Accept setIsLoading prop
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTestCases, setExpandedTestCases] = useState({});
  const [isCached, setIsCached] = useState(false);

  const initializeExpandedState = (data) => {
    const initialExpandedState = {};
    if (data.test_results) {
      data.test_results.forEach(tr => {
        initialExpandedState[tr.test_case_number] = false;
      });
    }
    setExpandedTestCases(initialExpandedState);
  };

  const handleClearCache = () => {
    localStorage.removeItem(`submission_${submissionId}`);
    window.location.reload();
  };

  useEffect(() => {
    const fetchSubmissionData = async () => {
      setIsLoading(true); // Use global loading

      // Check cache first
      const cachedData = getCachedSubmission(submissionId);
      if (cachedData) {
        setSubmissionData(cachedData);
        initializeExpandedState(cachedData);
        setIsCached(true);
        setIsLoading(false);
        return;
      }

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

        // Cache the data
        cacheSubmission(submissionId, data);

        initializeExpandedState(data);

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
      {isCached && (
        <div className="cache-notification">
          <p>This submission is being displayed from the cache. <button onClick={handleClearCache}>Clear Cache</button> to see the latest updates.</p>
        </div>
      )}
      <h2>Submission Details: {submissionId}</h2>
      <p><strong>Problem ID:</strong> {submissionData.problem_id}</p>
      <p><strong>User ID:</strong> {submissionData.user_id}</p>
      <p><strong>Language:</strong> {submissionData.language}</p>
      <p><strong>Status:</strong> <span className={`status-${submissionData.status.toLowerCase().replace(/ /g, '-').replace(/_/g, '-')}`}>
        {console.log('Submission Status:', submissionData.status)}
        {submissionData.status}
      </span></p>
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
                <p><strong>Test Case {testResult.test_case_number}:</strong> <span className={`test-case-status test-case-status-${testResult.status.toLowerCase().replace(/ /g, '-').replace(/_/g, '-')}`}>{testResult.status}</span></p>
                <button onClick={() => toggleTestCase(testResult.test_case_number)} className="test-case-toggle-button">
                  {expandedTestCases[testResult.test_case_number] ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {expandedTestCases[testResult.test_case_number] && (
                <div className="test-case-details">
                  <p><strong>Message:</strong> {testResult.message}</p>
                  <p><strong>Execution Time:</strong> {testResult.execution_time} s</p>
                  <p><strong>Memory Usage:</strong> {testResult.memory_usage} MB</p>
                  <div><strong>Input:</strong> <pre>{testResult.input}</pre></div>
                  <div><strong>Expected Output:</strong> <pre>{testResult.expected_output}</pre></div>
                  <div><strong>Actual Output:</strong> <pre>{testResult.actual_output}</pre></div>
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