# frontend-for-annaforces

This is the frontend for the Annaforces project, built with React.

## Getting Started

To run the frontend application:

1.  Navigate to the `frontend-for-annaforces/app` directory in your terminal.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  **Configure API Base URL:**
    Create a `.env` file in the `frontend-for-annaforces/app` directory and add the following line, replacing `YOUR_BACKEND_API_BASE_URL` with the actual URL of your backend API (e.g., `https://backend-for-annaforces.onrender.com`):
    ```
    REACT_APP_API_BASE_URL=YOUR_BACKEND_API_BASE_URL
    ```
4.  Start the development server:
    ```bash
    npm start
    ```
    The application will typically open in your browser at `http://localhost:3000`.

## Component Structure and Features

The project follows a modular component structure. Each component is located in its own directory inside `src/components`.

## Styling and Class Naming Convention

To maintain consistency and readability, all CSS class names should follow the `component-name-classname` convention (e.g., `login-container`, `header-nav`). This ensures that class names are unique and clearly associated with the component they belong to.

### Theme Switching (Light/Dark Mode)

The application supports light and dark themes, allowing users to switch between them. The theme is initially determined by the user's device preference (`prefers-color-scheme`). If the user manually changes the theme using the toggle button, this preference is saved in `localStorage` and persists across sessions.

Theme colors are sourced from `src/assets/gpt.json`.

Each component has its own `light.css` and `dark.css` files, which contain theme-specific styles. These styles are applied based on a `light-theme` or `dark-theme` class added to the `<body>` element, ensuring that only the relevant theme styles are active at any given time.

We have begun refactoring the frontend components to move inline styles into dedicated `index.css` files within each component's directory. This process also includes applying the `component-name-classname` convention to all elements and improving the overall aesthetic of the UI. Components that have been refactored include: `Header`, `Login`, `WelcomePage`, `Problems`, `ProblemDetail`, `ProblemSubmissions`, `CodeSubmission`, `UserSubmissions`, and `Credits`.

### Core Components

*   **`App.js`**: The main application component, handling global state (like authentication status) and routing.
*   **`Header`**: The application's navigation bar, displaying a logo, links, and user status (welcome message/logout button).
*   **`Login`**: Provides a form for user authentication against the backend API. Stores user credentials and token in `localStorage` upon successful login.
*   **`Logout`**: A component that triggers the logout process, clearing user data from `localStorage` and redirecting to the login page.
*   **`WelcomePage`**: A simple page displayed after successful user login.
*   **`Problems`**: Fetches and displays a list of all available problems from the backend. Includes search and filter functionalities (by title, ID, difficulty, and tags). Problem titles are clickable links to their detail pages.
*   **`ProblemDetail`**: Displays the detailed information for a specific problem, fetched from the backend. If the problem is not found, it displays a message indicating that the problem is not there.
*   **`Profile`**: Displays the logged-in user's profile information, fetched from the backend.
*   **`UserSubmissions`**: Displays a list of all submissions for a specific user, fetched from the backend. Includes filter functionalities (by problem ID, status, language, and timestamp). Each submission is a clickable link to its detailed view.
*   **`ProblemSubmissions`**: Displays a list of all submissions for a specific problem, fetched from the backend. Includes filter functionalities (by user ID, status, and timestamp). Each submission is a clickable link to its detailed view.
*   **`SubmissionDetail`**: Displays the detailed information for a specific submission, including code, language, status, and test results, fetched from the backend. If the submission is not found, it displays a message indicating that the submission is not there.
*   **`CodeSubmission`**: Provides a form for users to submit code for a specific problem, including language selection and code input.
*   **`Credits`**: Displays credits for the project, including contributors and technologies used.
*   **`Footer`**: Displays copyright information, links to About Us, Contact, and Privacy Policy pages.
*   **`AboutUs`**: Provides information about the Annaforces platform.
*   **`Contact`**: Provides contact details for Annaforces support.
*   **`PrivacyPolicy`**: Outlines the privacy policy of the Annaforces platform.
*   **`NotFound`**: Displays a 404 "Page Not Found" message, including the incorrect URL, and provides a link to the Welcome Page.
*   **`ProtectedRoute`**: A routing helper component that ensures only authenticated users can access certain routes.

### Authentication Flow

1.  Users are redirected to the `/login` page if not authenticated.
2.  Upon successful login via the `Login` component, user data (ID, username, name, and JWT token) is stored in `localStorage`.
3.  The application's state (`isLoggedIn`, `userName`, etc.) is updated, and the user is redirected to the `/welcome` page. This redirection is now explicitly handled to ensure immediate navigation after successful login.
4.  Authenticated users can navigate to protected routes like `/problems`.
5.  The JWT token is automatically included in API requests to protected backend endpoints.
6.  Clicking the "Logout" button clears `localStorage` and redirects the user back to the `/login` page.

### Routing

The application uses `react-router-dom` for navigation:

*   `/`: Redirects to `/welcome` if logged in, or `/login` if not.
*   `/login`: Displays the login form. If the user is already logged in, it redirects to `/welcome`.
*   `/welcome`: Displays the welcome message for logged-in users.
*   `/problems`: Displays a list of all problems (protected route).
*   `/problems/:problem_id`: Displays details for a specific problem (protected route).
*   `/problems/:problemId/submit`: Provides a form for submitting code to a specific problem (protected route).
*   `/problems/:problemId/submissions`: Displays a list of all submissions for a specific problem (protected route).
*   `/profile`: Displays the logged-in user's profile information (protected route).
*   `/users/:userId/submissions`: Displays a list of all submissions for a specific user (protected route).
*   `/submissions/:submissionId`: Displays detailed information for a specific submission (protected route).
*   `/credits`: Displays the credits page (protected route).
*   `/about`: Displays information about the platform.
*   `/contact`: Displays contact information.
*   `/privacy`: Displays the privacy policy.
*   Any other unmatched route redirects to `/login`.
