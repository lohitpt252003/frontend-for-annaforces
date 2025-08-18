import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserSubmissions = () => {
    const { userId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/submissions/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSubmissions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [userId]);

    if (loading) {
        return <div>Loading submissions...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Submissions for {userId}</h1>
            {submissions.length > 0 ? (
                <ul>
                    {submissions.map(submission => (
                        <li key={submission.id}>
                            <strong>Submission ID:</strong> {submission.id}<br/>
                            <strong>Problem ID:</strong> {submission.problem_id}<br/>
                            <strong>Status:</strong> {submission.status}<br/>
                            <strong>Timestamp:</strong> {submission.timestamp}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No submissions found for this user.</p>
            )}
        </div>
    );
};

export default UserSubmissions;