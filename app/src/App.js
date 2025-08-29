import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemDetail';
import UserList from './components/UserList';
import UserSubmissions from './components/UserSubmissions';
import ProblemSubmissions from './components/ProblemSubmissions';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<ProblemList />} />
            <Route path="/problems/:problem_id" element={<ProblemDetail />} />
            
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:user_id/submissions" element={<UserSubmissions />} />
            <Route path="/problems/:problem_id/submissions" element={<ProblemSubmissions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;