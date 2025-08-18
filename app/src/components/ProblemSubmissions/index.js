import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

/**
 * ProblemSubmissions Component
 * @description Displays a list of submissions for a specific problem fetched from the backend API.
 * @param {object} props - React component props. (No explicit props are used by this component).
 * @returns {JSX.Element} The JSX element representing the problem submissions page.
 * @async false
 */
function ProblemSubmissions() {
    // Extract the 'id' parameter (problem ID) from the URL.
    const { id } = useParams();
    // State to store the list of submissions fetched from the API.
    const [submissions, setSubmissions] = useState([]);
    // State to manage the loading status during API calls.
    const [loading, setLoading] = useState(true);
    // State to store any error that occurs during the API call.
    const [error, setError] = useState(null);

    // useEffect hook to perform side effects, fetching data based on the problem ID.
    useEffect(() => {
        /**
         * fetchSubmissions
         * @description Asynchronously fetches the list of submissions for a problem from the backend API.
         * @param {void} - No input parameters.
         * @returns {void} - Updates the component's state (submissions, loading, error).
         * @async true
         */
        const fetchSubmissions = async () => {
            try {
                // Make an API call to fetch the list of submissions for the given problem ID.
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${id}/submissions`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Set the submissions state with the data received from the API.
                setSubmissions(response.data);
            } catch (err) {
                // Catch and set any errors that occur during the API call.
                setError(err);
            } finally {
                // Set loading to false once the API call is complete, regardless of success or failure.
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [id]); // Dependency array includes 'id' so the effect re-runs if the ID changes.

    // Update page title once submissions data is loaded
    useEffect(() => {
        if (submissions) {
            document.title = `Submissions for Problem ${id}`;
        }
    }, [submissions, id]);

    // Display a loading message while the data is being fetched.
    if (loading) {
        return <div>Loading submissions...</div>;
    }

    // Display an error message if the API call failed.
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Submissions for Problem {id || 'NA'}</h1>
            {submissions.length > 0 ? (
                <ul>
                    {submissions.map(submission => (
                        <li key={submission.id || `submission-${Math.random()}`}>
                            <strong>Submission ID:</strong> {submission.id || 'NA'}<br/>
                            <strong>User ID:</strong> {submission.user_id || 'NA'}<br/>
                            <strong>Status:</strong> {submission.status || 'NA'}<br/>
                            <strong>Timestamp:</strong> {submission.timestamp || 'NA'}
                            {/* Add more submission details as needed */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No submissions found for this problem.</p>
            )}
        </div>
    );
}

export default ProblemSubmissions;
