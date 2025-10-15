import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import { getCachedSubmission, cacheSubmission, clearSubmissionCache } from '../cache';

import api from '../../utils/api'; // Import the new api utility

function SubmissionDetail({ token, setIsLoading }) { // Accept setIsLoading prop
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTestCases, setExpandedTestCases] = useState({});
  const [isCached, setIsCached] = useState(false);
  const pollingInterval = useRef(null);

  const initializeExpandedState = (data) => {
    const initialExpandedState = {};
    if (data.test_results) {
      data.test_results.forEach(tr => {
        initialExpandedState[tr.test_case_number] = false;
      });
    }
    setExpandedTestCases(initialExpandedState);
  };

  const handleClearCache = async () => {
    await clearSubmissionCache(submissionId);
    window.location.reload();
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    }, (err) => {
      toast.error('Failed to copy!');
      console.error('Could not copy text: ', err);
    });
  };

  const pollSubmissionStatus = async () => {
    try {
      const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/submissions/${submissionId}`, token);
      if (!data) return;

      setSubmissionData(data);

      const finalStatus = !data.status.startsWith("Running") && data.status !== "Queued";
      if (finalStatus) {
        console.log("Final status reached. Stopping polling.");
        clearInterval(pollingInterval.current);
        await cacheSubmission(submissionId, data); // Cache the final result
      }
    } catch (error) {
      console.error("Polling error:", error);
      setError(error);
      clearInterval(pollingInterval.current);
    }
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      setIsLoading(true); // Use global loading

      try {
        const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/submissions/${submissionId}`, token);
        if (!data) {
          // If API returns no data, try cache as a fallback
          const cachedData = await getCachedSubmission(submissionId);
          if (cachedData) {
            setSubmissionData(cachedData);
            initializeExpandedState(cachedData);
            setIsCached(true);
          } else {
            setError({ message: "No submission data found from API or cache." });
          }
          setIsLoading(false);
          return;
        }

        setSubmissionData(data);
        initializeExpandedState(data);
        setIsCached(false); // Data is fresh from API

        const isRunning = data.status.startsWith("Running") || data.status === "Queued";
        if (isRunning) {
          console.log("Submission is running. Starting polling.");
          pollingInterval.current = setInterval(pollSubmissionStatus, 1000);
        } else {
          await cacheSubmission(submissionId, data); // Cache if already final
        }

      } catch (error) {
        console.error("API fetch error:", error);
        // If API fetch fails, try to load from cache
        const cachedData = await getCachedSubmission(submissionId);
        if (cachedData) {
          setSubmissionData(cachedData);
          initializeExpandedState(cachedData);
          setIsCached(true);
          setError({ message: "Could not fetch latest data, displaying cached version." });
        } else {
          if (error.message.includes("You are not allowed to see the submission of the other user during the contest.")) {
              setError({ message: "You are not allowed to see the submission of other users during an active contest." });
          } else {
              setError(error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (submissionId && token) {
      fetchSubmission();
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
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
      <p><strong>Username:</strong> {submissionData.username} 🧑‍💻</p>
      <p><strong>Language:</strong> {submissionData.language}</p>
      <p><strong>Status:</strong> <span className={`status-${submissionData.status.toLowerCase().replace(/ /g, '-').replace(/_/g, '-')}`}>
        {console.log('Submission Status:', submissionData.status)}
        {submissionData.status}
      </span></p>
      <p><strong>Timestamp:</strong> {new Date(submissionData.timestamp).toLocaleString()}</p>

      <div className="code-header">
        <h3>Code:</h3>
        <button onClick={() => handleCopy(submissionData.code, 'Code')} className="copy-button">Copy Code</button>
      </div>
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
                  <div className="test-case-io">
                    <strong>Input:</strong>
                    <button onClick={() => handleCopy(testResult.input, 'Input')} className="copy-button-inline">Copy</button>
                    <pre>{testResult.input}</pre>
                  </div>
                  <div className="test-case-io">
                    <strong>Expected Output:</strong>
                    <button onClick={() => handleCopy(testResult.expected_output, 'Expected Output')} className="copy-button-inline">Copy</button>
                    <pre>{testResult.expected_output}</pre>
                  </div>
                  <div className="test-case-io">
                    <strong>Actual Output:</strong>
                    <button onClick={() => handleCopy(testResult.actual_output, 'Actual Output')} className="copy-button-inline">Copy</button>
                    <pre>{testResult.actual_output}</pre>
                  </div>
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
