


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';

function Profile({ userId, token }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setUserData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUserData();
    }
  }, [userId, token]);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-error">Error: {error.message}</div>;
  }

  if (!userData) {
    return <div className="profile-no-data">No user data found.</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p><strong>User ID:</strong> {userId}</p>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Bio:</strong> {userData.bio}</p>
      <p><strong>Joined:</strong> {userData.joined}</p>
      <p><strong>Number of Submissions:</strong> {userData.number_of_submissions}</p>
      <p><Link to={`/users/${userId}/submissions`}>View Submissions</Link></p>
      {/* Add more profile details as needed */}
    </div>
  );
}

export default Profile;



