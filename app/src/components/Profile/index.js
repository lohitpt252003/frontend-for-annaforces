import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility

function Profile({ loggedUserId, setIsLoading }) { // Removed token prop
  const { userId } = useParams(); // Get userId from URL params
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [solvedProblems, setSolvedProblems] = useState([]); // New state for solved problems

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true); // Use global loading
      try {
        const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, token);

        if (!response) { // If response is null, it means handleApiResponse redirected
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setUserData(data);
        setEditedName(data.name);
        setEditedUsername(data.username);
        setEditedBio(data.bio);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false); // Use global loading
      }
    };

    const fetchSolvedProblems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Error already handled by fetchUserData or global api handler
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/solved`, token);

        if (!response) { // If response is null, it means handleApiResponse redirected
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const solvedProblemIds = await response.json();
        setSolvedProblems(solvedProblemIds);

      } catch (error) {
        console.error("Error fetching solved problems:", error);
        // Optionally set an error state for solved problems
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) { // Removed token from dependency array
      fetchUserData();
      fetchSolvedProblems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Removed token from dependency array

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/update-profile`, {
        name: editedName,
        username: editedUsername,
        bio: editedBio
      }, token);

      if (!response) { // If response is null, it means handleApiResponse redirected
        return;
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Profile updated successfully!');
        setIsEditing(false);
        // Re-fetch user data to update the displayed profile
        const updatedResponse = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, token);

        if (!updatedResponse) {
          return;
        }

        const updatedData = await updatedResponse.json();
        if (updatedResponse.ok) {
          setUserData(updatedData);
        } else {
          toast.error(updatedData.error || 'Failed to re-fetch updated profile data.');
        }
      } else {
        toast.error(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error('Network error or server is unreachable.');
      console.error('Update profile error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert changes
    if (userData) {
      setEditedName(userData.name);
      setEditedUsername(userData.username);
      setEditedBio(userData.bio);
    }
  };

  if (error) {
    return <div className="profile-error">Error: {error.message}</div>;
  }

  if (!userData) {
    return <div className="profile-no-data">No user data found.</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile 🧑‍💻</h2>
      {isEditing ? (
        <div className="profile-edit-form">
          <div className="profile-form-group">
            <label htmlFor="editName">Name:</label>
            <input
              type="text"
              id="editName"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="editUsername">Username:</label>
            <input
              type="text"
              id="editUsername"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="editBio">Bio:</label>
            <textarea
              id="editBio"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              rows="4"
            ></textarea>
          </div>
          <div className="profile-actions">
            <button onClick={handleSave} className="profile-save-button">Save</button>
            <button onClick={handleCancel} className="profile-cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="profile-display">
          <p><strong>User ID:</strong> 🆔 {userId}</p>
          <p><strong>Username:</strong> 🧑‍💻 {userData.username}</p>
          <p><strong>Name:</strong> 📛 {userData.name}</p>
          <p><strong>Bio:</strong> 📖 {userData.bio}</p>
          <p><strong>Joined:</strong> 📅 {userData.joined}</p>
          <p><strong>Number of Submissions:</strong> 📋 {userData.number_of_submissions}</p>
          <p><strong>Solved Problems:</strong> ✅
            {solvedProblems.length > 0 ? (
              <ul className="profile-solved-problems-list">
                {solvedProblems.map(problemId => (
                  <li key={problemId} className="profile-solved-problem-item">
                    <Link to={`/problems/${problemId}`}>{problemId}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              'None'
            )}
          </p>
          {loggedUserId === userId && (
            <div className="profile-actions-bottom">
              <Link to={`/users/${userId}/submissions`} className="profile-view-submissions-link">View Submissions 📋</Link>
              <button onClick={() => setIsEditing(true)} className="profile-edit-button">Edit Profile ✏️</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;