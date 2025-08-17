import React from 'react';
// BrowserRouter is used to enable client-side routing with URL segments.
// Route and Routes define the mapping between URL paths and React components.
// Link is used for navigation between routes without full page reloads.
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// Importing the ProblemsList component from its new organized location.
import ProblemsList from './components/ProblemsList';
// Importing the ProblemDetail component from its new organized location.
import ProblemDetail from './components/ProblemDetail';
import ProblemSubmissions from './components/ProblemSubmissions';
import Login from './components/Login/Login.js';
import './App.css';

/**
 * App Component
 * @description The main application component responsible for setting up routing and navigation.
 * @param {object} props - React component props. (No explicit props are used by this component).
 * @returns {JSX.Element} The JSX element representing the application's structure and routes.
 * @async false
 */
function App() {
  return (
    // Router wraps the entire application to enable routing.
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/problems">Problems</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        {/* Routes define the different paths and the components to render for each. */}
        <Routes>
          {/* Route for the problems listing page. */}
          <Route path="/problems" element={<ProblemsList />} />
          {/* Route for individual problem details, using a dynamic ID parameter. */}
          <Route path="/problems/:id" element={<ProblemDetail />} />
          {/* Route for problem submissions, using a dynamic ID parameter. */}
          <Route path="/problems/:id/submissions" element={<ProblemSubmissions />} />
          {/* Route for the login page. */}
          <Route path="/login" element={<Login />} />
          {/* Default route for the home page. */}
          <Route path="/" element={
            <header className="App-header">
              {/* Original App content can go here or be removed */}
              <p>Welcome to the Annaforces Coding Platform!</p>
              <p>Navigate to <Link to="/problems">Problems</Link> to see the list.</p>
            </header>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
