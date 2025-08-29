import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState({});

  useEffect(() => {
    axios.get('/api/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(users).map(userId => (
            <tr key={userId}>
              <td>{userId}</td>
              <td>
                <Link to={`/users/${userId}/submissions`}>{users[userId].username}</Link>
              </td>
              <td>{users[userId].Name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;