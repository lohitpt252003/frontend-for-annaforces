# frontend-for-annaforces

This is the frontend for the Annaforces project, built with React.

## Getting Started

To run the frontend application:

1.  Navigate to the `frontend-for-annaforces/app` directory in your terminal.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The application will typically open in your browser at `http://localhost:3000`.

## Component Structure and Features

The project follows a modular component structure. Each component is located in its own directory inside `src/components`.

### Core Components

*   **`App.js`**: The main application component, handling global state (like authentication status) and routing.
*   **`Header`**: The application's navigation bar, displaying a logo, links, and user status (welcome message/logout button).
*   **`Login`**: Provides a form for user authentication against the backend API. Stores user credentials and token in `localStorage` upon successful login.
*   **`Logout`**: A component that triggers the logout process, clearing user data from `localStorage` and redirecting to the login page.
*   **`WelcomePage`**: A simple page displayed after successful user login.
*   **`Problems`**: Fetches and displays a list of all available problems from the backend. Problem titles are clickable links to their detail pages.
*   **`ProblemDetail`**: Displays the detailed information for a specific problem, fetched from the backend.
*   **`ProtectedRoute`**: A routing helper component that ensures only authenticated users can access certain routes.

### Authentication Flow

1.  Users are redirected to the `/login` page if not authenticated.
2.  Upon successful login via the `Login` component, user data (ID, username, name, and JWT token) is stored in `localStorage`.
3.  The application's state (`isLoggedIn`, `userName`, etc.) is updated, and the user is redirected to the `/welcome` page.
4.  Authenticated users can navigate to protected routes like `/problems`.
5.  The JWT token is automatically included in API requests to protected backend endpoints.
6.  Clicking the "Logout" button clears `localStorage` and redirects the user back to the `/login` page.

### Routing

The application uses `react-router-dom` for navigation:

*   `/`: Redirects to `/welcome` if logged in, or `/login` if not.
*   `/login`: Displays the login form.
*   `/welcome`: Displays the welcome message for logged-in users.
*   `/problems`: Displays a list of all problems (protected route).
*   `/problems/:problem_id`: Displays details for a specific problem (protected route).
*   Any other unmatched route redirects to `/login`.