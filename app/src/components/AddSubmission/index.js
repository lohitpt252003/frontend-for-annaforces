import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './AddSubmission.css';

const AddSubmission = () => {
    const { id } = useParams();
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [message, setMessage] = useState('');
    const [submissionResult, setSubmissionResult] = useState(null);
    const [revealedTestCases, setRevealedTestCases] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = `Submit to Problem ${id}`;
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setSubmissionResult(null);
        setRevealedTestCases({});
        setSubmitting(true);

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user || !user.user_id) {
            setError('You must be logged in to submit a solution.');
            setSubmitting(false);
            return;
        }

        if (!code.trim()) {
            setError('Code cannot be empty.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/problems/${id}/submit`,
                {
                    user_id: user.user_id,
                    code,
                    language,
                }
            );
            console.log(response.data);
            
            setMessage(`Submission ${response.data.status}!`);
            setSubmissionResult(response.data);
            setCode(''); // Clear the textarea after successful submission
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(err.response.data.error || `Error: ${err.response.status} ${err.response.statusText}`);
            } else if (err.request) {
                // The request was made but no response was received
                setError('Network Error: Could not connect to the server. Please check your internet connection or try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const toggleReveal = (index) => {
        setRevealedTestCases(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="add-submission-container">
            <h2 className="add-submission-title">Submit Solution for Problem {id}</h2>
            <div className="back-link">
                <Link to={`/problems/${id}`}>&larr; Back to Problem</Link>
            </div>
            <form onSubmit={handleSubmit} className="submission-form">
                <div className="form-group">
                    <label htmlFor="language-select" className="form-label">Language:</label>
                    <select
                        id="language-select"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="form-control"
                        disabled={submitting}
                    >
                        <option value="python">Python</option>
                        <option value="c">C</option>
                        <option value="c++">C++</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="code-editor" className="form-label">Your Code:</label>
                    <textarea
                        id="code-editor"
                        rows="20"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="form-control code-editor"
                        placeholder="Enter your code here..."
                        disabled={submitting}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Solution'}
                </button>
            </form>
            {message && <div className={`alert ${submissionResult?.status === 'accepted' ? 'alert-success' : 'alert-info'}`}>{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {submissionResult && (
                <div className="submission-results">
                    <h3>Overall Result: <span className={submissionResult.status === 'accepted' ? 'text-success' : 'text-danger'}>{submissionResult.status}</span></h3>
                    <p>{submissionResult.message}</p>
                    
                    {submissionResult.test_results && submissionResult.test_results.length > 0 && (
                        <div className="test-cases-results">
                            <h4>Test Cases:</h4>
                            {submissionResult.test_results.map((test, index) => (
                                <div key={index} className={`test-case-card ${test.status === 'passed' ? 'passed' : 'failed'}`}>
                                    <h5>Test Case {index + 1}: <span className={test.status === 'passed' ? 'text-success' : 'text-danger'}>{test.status}</span>
                                        <button onClick={() => toggleReveal(index)} className="btn btn-sm btn-info reveal-btn">
                                            {revealedTestCases[index] ? 'Hide Details' : 'Show Details'}
                                        </button>
                                    </h5>
                                    {revealedTestCases[index] && (
                                        <>
                                            <p><strong>Message:</strong> {test.message}</p>
                                            <p><strong>Execution Time:</strong> {test.execution_time !== undefined ? `${test.execution_time.toFixed(4)}s` : 'N/A'}</p>
                                            <p><strong>Memory Usage:</strong> {test.memory_usage !== undefined ? `${test.memory_usage.toFixed(2)}MB` : 'N/A'}</p>
                                            <div className="code-block">
                                                <h6>Actual Output:</h6>
                                                <pre>{test.actual_output}</pre>
                                            </div>
                                            <div className="code-block">
                                                <h6>Expected Output:</h6>
                                                <pre>{test.expected_output}</pre>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddSubmission;