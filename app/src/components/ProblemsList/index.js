import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * ProblemsList Component
 * @description Displays a list of coding problems fetched from the backend API.
 * @param {object} props - React component props. (No explicit props are used by this component).
 * @returns {JSX.Element} The JSX element representing the problems list page.
 * @async false
 */
function ProblemsList() {
    // State to store the list of problems fetched from the API.
    const [problems, setProblems] = useState([]);
    // State to manage the loading status during API calls.
    const [loading, setLoading] = useState(true);
    // State to store any error that occurs during the API call.
    const [error, setError] = useState(null);

    // useEffect hook to perform side effects, in this case, fetching data when the component mounts.
    useEffect(() => {
        document.title = 'Problems List';

        /**
         * fetchProblems
         * @description Asynchronously fetches the list of problems from the backend API.
         * @param {void} - No input parameters.
         * @returns {void} - Updates the component's state (problems, loading, error).
         * @async true
         */
        const fetchProblems = async () => {
            try {
                // Make an API call to fetch the list of problems.
                // The base URL is retrieved from environment variables for flexibility.
                // The /api/problems endpoint is used as per the API design.
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Set the problems state with the 'list' array from the API response.
                // This handles the specific structure of the backend API response.
                setProblems(response.data);
            } catch (err) {
                // Catch and set any errors that occur during the API call.
                setError(err);
            } finally {
                // Set loading to false once the API call is complete, regardless of success or failure.
                setLoading(false);
            }
        };

        fetchProblems();
    }, []); // Empty dependency array ensures this effect runs only once after the initial render.

    // Display a loading message while the data is being fetched.
    if (loading) {
        return <div>Loading problems...</div>;
    }

    // Display an error message if the API call failed.
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Problems</h1>
            <ul>
                {/* Map through the problems array to render each problem as a list item. */}
                {/* Use a unique key for each list item, falling back to a random key if problem.id is missing. */}
                {Array.isArray(problems) && problems.map(problem => (
                    <li key={problem.id || `problem-${Math.random()}`}>
                        {/* Link to the individual problem detail page. */}
                        {/* Display 'NA' for problem.id or problem.title if they are missing from the API response. */}
                        <Link to={`/problems/${problem.id || 'NA'}`}>{problem.title || 'NA'}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProblemsList;
