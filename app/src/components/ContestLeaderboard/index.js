import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import './light.css';
import './dark.css';

function ContestLeaderboard({ leaderboardData, contest }) {
  return (
    <div className="contest-leaderboard-section">
      <h3>Leaderboard 🏆</h3>
      {!leaderboardData ? (
        <p>Loading leaderboard...</p>
      ) : leaderboardData.standings.length === 0 ? (
        <p>No participants on the leaderboard yet.</p>
      ) : (
        <div className="leaderboard-table-container">
          <p>Last Updated: {new Date(leaderboardData.last_updated).toLocaleString()}</p>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Total Score</th>
                <th>Total Penalty</th>
                {contest.problems.map(pId => (
                  <th key={pId}>{pId}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboardData.standings.map((entry, index) => (
                <tr key={entry.user_id}>
                  <td>{index + 1}</td>
                  <td><Link to={`/users/${entry.user_id}`}>{entry.user_id}</Link></td>
                  <td>{entry.username}</td>
                  <td>{entry.total_score}</td>
                  <td>{entry.total_penalty}</td>
                  {contest.problems.map(pId => (
                    <td key={pId}>
                      {entry.problems[pId] ? 
                        `${entry.problems[pId].status === 'solved' ? '✅' : '❌'} (${entry.problems[pId].attempts})`
                        : '-'
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContestLeaderboard;
