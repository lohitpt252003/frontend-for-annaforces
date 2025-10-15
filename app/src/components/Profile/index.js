import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './index.css'; // Import the CSS file
import './light.css';
import './dark.css';
import api from '../../utils/api'; // Import the new api utility

function Profile({ loggedUsername }) { // Renamed prop
  const { username } = useParams(); // Get username from URL params
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [attendedContests, setAttendedContests] = useState([]); // New state for attended contests
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  useEffect(() => {
    const fetchUserDataAndContests = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setIsLoadingLocal(false);
        return;
      }

      setIsLoadingLocal(true);
      try {
        const data = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${username}`, token);
        if (!data) return;
        
        setUserData(data);
        setEditedName(data.name);
        setEditedUsername(data.username);
        setEditedBio(data.bio);

        // Extract attended contests from userData
        setAttendedContests(Object.keys(data.contests || {}));

      } catch (error) {
        setError(error);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    if (username) {
      fetchUserDataAndContests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in.');
      return;
    }

    setIsLoadingLocal(true);
    try {
      const data = await api.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/${username}/update-profile`, {
        name: editedName,
        username: editedUsername,
        bio: editedBio
      }, token);

      if (!data) return;

      toast.success(data.message || 'Profile updated successfully!');
      setIsEditing(false);

      // Re-fetch user data to update the displayed profile
      const updatedData = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${username}`, token);
      if (updatedData) {
        setUserData(updatedData);
      } else {
        toast.error('Failed to re-fetch updated profile data.');
      }
    } catch (err) {
      toast.error(err.message || 'Network error or server is unreachable.');
      console.error('Update profile error:', err);
    } finally {
      setIsLoadingLocal(false);
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

  if (isLoadingLocal) {
    return <div className="profile-loading">Loading profile...</div>;
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
          <p><strong>Username:</strong> 🧑‍💻 {userData.username}</p>
          <p><strong>Name:</strong> 📛 {userData.name}</p>
          <p><strong>Bio:</strong> 📖 {userData.bio}</p>
          <p><strong>Joined:</strong> 📅 {userData.joined}</p>
          <p><strong>Number of Submissions:</strong> 📋 {userData.number_of_submissions}</p>
          <p><strong>Attempted Problems:</strong> 🧠
            {Object.keys(userData.attempted || {}).length > 0 ? (
              <ul className="profile-solved-problems-list">
                {Object.keys(userData.attempted).map(problemId => (
                  <li key={problemId} className="profile-solved-problem-item">
                    <Link to={`/problems/${problemId}`}>{problemId}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              'None'
            )}
          </p>
          <p><strong>Solved Problems:</strong> ✅
            {Object.keys(userData.solved || {}).length > 0 ? (
              <ul className="profile-solved-problems-list">
                {Object.keys(userData.solved).map(problemId => (
                  <li key={problemId} className="profile-solved-problem-item">
                    <Link to={`/problems/${problemId}`}>{problemId}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              'None'
            )}
          </p>
          <p><strong>Not Solved Problems:</strong> ❌
            {Object.keys(userData.not_solved || {}).length > 0 ? (
              <ul className="profile-solved-problems-list">
                {Object.keys(userData.not_solved).map(problemId => (
                  <li key={problemId} className="profile-solved-problem-item">
                    <Link to={`/problems/${problemId}`}>{problemId}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              'None'
            )}
          </p>
          <p><strong>Attended Contests:</strong> 🏆
            {attendedContests.length > 0 ? (
              <ul className="profile-solved-problems-list">
                {attendedContests.map(contestId => (
                  <li key={contestId} className="profile-solved-problem-item">
                    <Link to={`/contests/${contestId}`}>{contestId}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              'None'
            )}
          </p>
          {loggedUsername === username && (
            <div className="profile-actions-bottom">
              <Link to={`/users/${username}/submissions`} className="profile-view-submissions-link">View Submissions 📋</Link>
              <button onClick={() => setIsEditing(true)} className="profile-edit-button">Edit Profile ✏️</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;