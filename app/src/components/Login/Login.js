import React, { useState } from 'react';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!userId) {
            setError('Please enter a User ID');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('username', data.username);
                localStorage.setItem('name', data.name);
                alert('Login successful!');
                // You can redirect the user to another page here
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
