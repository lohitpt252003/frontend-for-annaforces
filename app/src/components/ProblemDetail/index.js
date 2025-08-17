import React, { useEffect, useState } from 'react';
import axios from 'axios';
// useParams hook is used to access URL parameters, in this case, the problem ID.
import { useParams, Link } from 'react-router-dom';

/**
 * ProblemDetail Component
 * @description Displays the detailed information for a single coding problem fetched from the backend API.
 * @param {object} props - React component props. (No explicit props are used by this component).
 * @returns {JSX.Element} The JSX element representing the problem detail page.
 * @async false
 */
function ProblemDetail() {
    // Extract the 'id' parameter from the URL.
    const { id } = useParams();
    // State to store the details of the single problem fetched from the API.
    const [problem, setProblem] = useState(null);
    // State to manage the loading status during API calls.
    const [loading, setLoading] = useState(true);
    // State to store any error that occurs during the API call.
    const [error, setError] = useState(null);

    // useEffect hook to perform side effects, fetching data based on the problem ID.
    useEffect(() => {
        /**
         * fetchProblem
         * @description Asynchronously fetches the details of a single problem from the backend API.
         * @param {void} - No input parameters.
         * @returns {void} - Updates the component's state (problem, loading, error).
         * @async true
         */
        const fetchProblem = async () => {
            try {
                // Make an API call to fetch the details of a specific problem.
                // The base URL is from environment variables, and the ID is from the URL parameter.
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/problems/${id}`);
                // Set the problem state with the data received from the API.
                setProblem(response.data);
            } catch (err) {
                // Catch and set any errors that occur during the API call.
                setError(err);
            } finally {
                // Set loading to false once the API call is complete, regardless of success or failure.
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id]); // Dependency array includes 'id' so the effect re-runs if the ID changes.

    // Update page title once problem data is loaded
    useEffect(() => {
        if (problem) {
            document.title = `Problem: ${problem.title || 'NA'}`;
        }
    }, [problem]);

    // Display a loading message while the data is being fetched.
    if (loading) {
        return <div>Loading problem details...</div>;
    }

    // Display an error message if the API call failed.
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Display a message if no problem data is found after loading.
    if (!problem) {
        return <div>Problem not found.</div>;
    }

    return (
        <div>
            {/* Display problem title, or 'NA' if missing. */}
            <h1>{problem.title || "NA"}</h1>
            {/* Display problem description, or 'NA' if missing. */}
            <p><strong>Description:</strong> {problem.description || "NA"}</p>
            {/* Display problem difficulty, or 'NA' if missing. */}
            <p><strong>Difficulty:</strong> {problem.difficulty || "NA"}</p>
            <p><Link to={`/problems/${id}/submissions`}>View Submissions</Link></p>
            
            <h2>Statement</h2>
            {/* Display problem statement, or 'NA' if missing. */}
            <p>{problem.statement || "NA"}</p>

            <h2>Input Format</h2>
            {/* Display input format, or 'NA' if missing. */}
            <p>{problem.input_format || "NA"}</p>

            <h2>Output Format</h2>
            {/* Display output format, or 'NA' if missing. */}
            <p>{problem.output_format || "NA"}</p>

            <h2>Time Limit</h2>
            {/* Display time limit, or 'NA' if missing. */}
            <p>{problem.time_limit || "NA"}</p>

            <h2>Space Limit</h2>
            {/* Display space limit, or 'NA' if missing. */}
            <p>{problem.space_limit || "NA"}</p>

            <h2>Sample Testcases</h2>
            {/* Conditionally render sample testcases if available. */}
            {problem.sample_testcases && problem.sample_testcases.length > 0 ? (
                problem.sample_testcases.map((testcase, index) => (
                    <div key={index}>
                        <h3>Sample {index + 1}</h3>
                        <p><strong>Input:</strong></p>
                        {/* Display testcase input, or 'NA' if missing. */}
                        <pre>{testcase.input || "NA"}</pre>
                        <p><strong>Output:</strong></p>
                        {/* Display testcase output, or 'NA' if missing. */}
                        <pre>{testcase.output || "NA"}</pre>
                        {/* Display testcase explanation if available, or 'NA' if missing. */}
                        {testcase.explanation && (
                            <p><strong>Explanation:</strong> {testcase.explanation || "NA"}</p>
                        )}
                    </div>
                ))
            ) : (
                // Display message if no sample testcases are available.
                <p>No sample testcases available.</p>
            )}
        </div>
    );
}

export default ProblemDetail;