# frontend-for-annaforces

This is the frontend for the Annaforces project, built with React.

## Project Structure

The main application directory is `frontend-for-annaforces/app`.

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

### Custom Fonts

The application now uses the "Ubuntu" font for all text and "Ubuntu Mono" for all code blocks. The font files are self-hosted within the application to ensure a consistent look and feel, even if the user does not have the fonts installed on their system. The fonts were sourced from Google Fonts and are licensed under the Ubuntu Font License.

### Theme Switching (Light/Dark Mode)

The application supports light and dark themes, allowing users to switch between them. The theme is initially determined by the user's device preference (`prefers-color-scheme`). If the user manually changes the theme using the toggle button, this preference is saved in `localStorage` and persists across sessions.

Theme colors are sourced from `src/assets/gpt.json`.

Each component has its own `light.css` and `dark.css` files, which contain theme-specific styles. These styles are applied based on a `light-theme` or `dark-theme` class added to the `<body>` element, ensuring that only the relevant theme styles are active at any given time.

We have begun refactoring the frontend components to move inline styles into dedicated `index.css` files within each component's directory. This process also includes applying the `component-name-classname` convention to all elements and improving the overall aesthetic of the UI. Components that have been refactored include: `Header`, `Login`, `WelcomePage`, `Problems`, `ProblemDetail`, `ProblemSubmissions`, `CodeSubmission`, `UserSubmissions`, `Credits`, and `SolutionDetail`.

### Global Loading Indicator

The application now includes a global loading indicator (spinner) that is displayed during API calls. This is implemented using the `react-spinners` package.

-   **`LoadingSpinner`**: A reusable component that renders a spinner.
-   **`App.js`**: Manages a global `isLoading` state and passes a `setGlobalLoading` function to components that make API calls. It conditionally renders the `LoadingSpinner` based on the `isLoading` state.
-   **API-calling Components**: Components like `Login`, `Problems`, `ProblemDetail`, `CodeSubmission`, `ProblemSubmissions`, `Profile`, and `UserSubmissions` now accept `setGlobalLoading` as a prop. They call `setGlobalLoading(true)` before initiating an API request and `setGlobalLoading(false)` in the `finally` block of the API call to hide the spinner.

### Toast Notifications

The application uses `react-toastify` to display success and error messages to the user. The `ToastContainer` is included in `App.js`, and individual components use the `toast` function to trigger notifications.

### Visual Enhancements

Significant effort has been made to improve the visual appeal and user experience across the application:

-   **Enhanced Styling**: The `SubmissionDetail` and `Credits` pages have received comprehensive styling updates, including modern layouts, improved typography, better spacing, and refined element designs. The `ProblemDetail` page has also been refined with improved layout for problem information and action buttons, and the problem statement content is now visually centered for better readability.
-   **Icons in Credits**: The `Credits` page now features relevant icons (e.g., GitHub, LinkedIn) for contributor links, enhancing visual clarity and engagement.
-   **Emojis Across Pages**: Emojis have been strategically added to various pages and components throughout the application, including titles, labels, buttons, and list items, to provide a more friendly and intuitive user interface.

### Caching

The application uses `localStorage` to cache submission details. When a user visits a submission detail page, the data is fetched from the backend and stored in `localStorage`. Subsequent visits to the same submission page will load the data from the cache, improving performance. The caching logic is encapsulated in the `src/components/cache` component.

### Recent Frontend Enhancements

-   **SubmissionDetail Component:**
    -   Test cases now collapse by default, improving readability for submissions with many test cases.
    -   Test case statuses are now color-coded for quick visual feedback: green for "passed", red for "wrong answer", yellow for "runtime error", "time limit exceeded", and "memory limit exceeded", and grey for "compilation error".
    -   Input for each test case is now displayed, providing more context for debugging.

### Core Components

*   **`Login`**: Provides a form for user authentication against the backend API. Displays a loading indicator during submission. Stores user credentials and token in `localStorage` upon successful login. If a user's account is unverified, they will be redirected to the OTP verification page.
*   **`Signup`**: Provides a form for new user registration. After successful registration, redirects the user to the OTP verification page.
*   **`OTPVerification`**: Allows users to verify their email address by entering an OTP sent to their registered email. Upon successful verification, the user can then log in.
*   **`Logout`**: A component that triggers the logout process, clearing user data from `localStorage` and redirecting to the login page.
*   **`WelcomePage`**: A simple page displayed after successful user login.
*   **`Problems`**: Fetches and displays a list of all available problems from the backend. Includes search and filter functionalities (by title, ID, difficulty, and tags). Problem titles are clickable links to their detail pages. Now includes a "View Solution" button for each problem.
*   **`ProblemDetail`**: Displays the detailed information for a specific problem, fetched from the backend. If the problem is not found, it displays a message indicating that the problem is not there. Now includes a "View Solution" button.
*   **`SolutionDetail`**: Displays the solution code (Python, C++, C) and explanation (`solution.md`) for a specific problem, fetched from the backend. Handles loading states and errors.
*   **`Profile`**: Displays user profile information. Now allows editing of name, username, and bio. Also displays a list of solved problems with clickable links to problem details.
*   **`UserSubmissions`**: Displays a sortable table of all submissions for a specific user, fetched from the backend. Includes robust filter functionalities (by problem ID, status, language, and timestamp) with dynamically generated status options to ensure accuracy. Each submission ID is a clickable link to its detailed view, and problem IDs are now clickable links to problem details.
*   **`ProblemSubmissions`**: Displays a list of all submissions for a specific problem, fetched from the backend. Includes filter functionalities (by user ID, status, and timestamp). Each submission is a clickable link to its detailed view, and user IDs are now clickable links to user profiles.
*   **`SubmissionDetail`**: Displays the detailed information for a specific submission, including code, language, status, and test results, fetched from the backend. Test cases now collapse by default, and their statuses are color-coded (green for passed, red for wrong answer, yellow for runtime/time limit/memory limit, grey for compilation error). Input for each test case is also displayed. If the submission is not found, it displays a message indicating that the submission is not there.
*   **`CodeSubmission`**: Provides a form for users to submit code for a specific problem, including language selection and code input.
*   **`Credits`**: Displays credits for the project, including contributors and technologies used.
*   **`Footer`**: Displays copyright information, links to About Us, Contact, and Privacy Policy pages.
*   **`AboutUs`**: Provides information about the Annaforces platform.
*   **`Contact`**: Provides contact details for Annaforces support.
*   **`PrivacyPolicy`**: Outlines the privacy policy of the Annaforces platform.
*   **`NotFound`**: Displays a 404 "Page Not Found" message, including the incorrect URL, and provides a link to the Welcome Page.
*   **`ProtectedRoute`**: A routing helper component that ensures only authenticated users can access certain routes.
*   **`ForgotPassword`**: Provides a form for users to request their User ID or initiate a password reset via OTP. Sends an OTP to the user's email for password reset requests. The OTP is discarded after 3 incorrect attempts.
*   **`ResetPassword`**: Allows users to reset their password by providing their email, the OTP received, and a new password.

### Authentication Flow

1.  Users are redirected to the `/login` page if not authenticated.
2.  **Signup Process:**
    *   Users can register via the `/signup` page by providing a User ID, Username, Password, Name, and Email.
    *   Upon successful registration, an OTP is sent to the provided email address.
    *   The user is then redirected to the `/verify-otp/:userId` page to enter the OTP.
    *   Once the OTP is successfully verified, the user's account is activated, and they can proceed to log in.
3.  **Login Process:**
    *   Upon successful login via the `Login` component, user data (ID, username, name, and JWT token) is stored in `localStorage`.
    *   If a user attempts to log in with an unverified account, they will be redirected to the `/verify-otp/:userId` page.
    *   The application's state (`isLoggedIn`, `userName`, etc.) is updated, and the user is redirected to the `/welcome` page.
4.  Authenticated users can navigate to protected routes like `/problems`.
5.  The JWT token is automatically included in API requests to protected backend endpoints.
6.  Clicking the "Logout" button clears `localStorage` and redirects the user back to the `/login` page.

### Routing

*   `/`: Redirects to `/welcome` if logged in, or `/login` if not.
*   `/login`: Displays the login form. If the user is already logged in, it redirects to `/welcome`.
*   `/signup`: Displays the signup form.
*   `/verify-otp/:userId`: Allows users to verify their email with an OTP.
*   `/welcome`: Displays the welcome message for logged-in users.
*   `/problems`: Displays a list of all problems (protected route).
*   `/problems/:problem_id`: Displays details for a specific problem (protected route).
*   `/problems/:problemId/submit`: Provides a form for submitting code to a specific problem (protected route).
*   `/problems/:problemId/submissions`: Displays a list of all submissions for a specific problem (protected route).
*   `/problems/:problemId/solution`: Displays the solution code and explanation for a specific problem (protected route).
*   `/profile`: Displays the logged-in user's profile information (protected route).
*   `/users/:userId/submissions`: Displays a list of all submissions for a specific user (protected route).
*   `/submissions/:submissionId`: Displays detailed information for a specific submission (protected route).
*   `/credits`: Displays the credits page (protected route).
*   `/about`: Displays information about the platform.
*   `/contact`: Displays contact information.
*   `/privacy`: Outlines the privacy policy of the Annaforces platform.
*   Any other unmatched route redirects to `/login`.