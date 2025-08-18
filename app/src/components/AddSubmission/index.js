import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddSubmission = () => {
    const { id } = useParams();
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            setMessage('You must be logged in to submit.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/submissions/add_submission`, {
                problem_id: id,
                user_id: user.user_id,
                code,
                language
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
        } catch (err) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Submit Solution for Problem {id}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Language:</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="c_cpp">C++</option>
                    </select>
                </div>
                <div>
                    <label>Code:</label>
                    <textarea
                        rows="20"
                        cols="80"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddSubmission;