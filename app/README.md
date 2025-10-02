# frontend-for-annaforces

This is the frontend for the Annaforces project, built with React.

## Data Structure

For a detailed understanding of how problems, submissions, users, and solutions are structured and stored, please refer to the [DATA/README.md](../../DATA/README.md) file.

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

### PDF Support

The application now supports PDF versions of problem statements and solutions.

-   **`ProblemDetail`**: If a PDF version of the problem statement is available, a "View PDF Statement" button will be displayed. Clicking this button will open the PDF in a new tab.
-   **`SolutionDetail`**: If a PDF version of the solution is available, a "View PDF Solution" button will be displayed. Clicking this button will open the PDF in a new tab.

This feature is enabled by checking for `has_pdf_statement` and `has_pdf_solution` flags in the API responses.

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

To enhance performance and avoid re-fetching data, the application employs a robust caching strategy. To overcome the storage limitations of `localStorage`, the application now uses **IndexedDB** for all API response caching, managed via the `idb-keyval` library. This provides a much larger storage capacity, preventing errors related to storage limits.

-   **Authentication Data:** User authentication information (like JWT tokens) is stored in `localStorage` for quick and synchronous access.
-   **API Responses:** All other cached data, such as submission details, problem details, and contest information, is stored in IndexedDB.

The caching logic is encapsulated in the `src/components/cache` directory, with a dedicated module for each type of cached data.

### Recent Frontend Enhancements

-   **Contest Registration Status in Detail Page:** The `ContestDetail` component now displays the user's registration status for the specific contest, showing "Registered ✅" if the user has joined, or a "Register 📝" button if they haven't and the contest is upcoming/running.
    -   The `ProblemSubmissions` component now displays the username alongside the user ID in the submissions table, including a `🧑‍💻` emoji.
    -   The `UserSubmissions` component now displays the username of the user whose submissions are being viewed in the header, also with a `🧑‍💻` emoji.
    -   The `SubmissionDetail` component now displays the submitter's username next to their user ID, accompanied by a `🧑‍💻` emoji.
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
*   **`ProblemDetail`**: Displays the detailed information for a specific problem. If the problem belongs to an upcoming contest, it displays an informational message. It uses caching to improve performance.
*   **`SampleCases`**: A dedicated component for displaying sample input/output test cases for problems. It provides a convenient "Copy" button for each input and output, allowing users to easily copy the content to their clipboard. Toast notifications are used to provide feedback on copy operations.
*   **`Profile`**: Displays user profile information. Now allows editing of name, username, and bio. Also displays a list of solved problems with clickable links to problem details.
*   **`UserSubmissions`**: Displays a sortable table of all submissions for a specific user, fetched from the backend. Includes robust filter functionalities (by problem ID, status, language, and timestamp) with dynamically generated status options to ensure accuracy. Each submission ID is a clickable link to its detailed view, and problem IDs are now clickable links to user profiles.
*   **`ProblemSubmissions`**: Displays a list of all submissions for a specific problem, fetched from the backend. Includes filter functionalities (by user ID, status, and timestamp). Each submission is a clickable link to its detailed view, and user IDs are now clickable links to user profiles.
*   **`SubmissionDetail`**: Displays the detailed information for a specific submission. Access to submissions is restricted during a running contest to the owner of the submission.
*   **`SolutionDetail`**: Displays the solution for a specific problem. Access to solutions is restricted for problems in a running or scheduled contest.
*   **`CodeSubmission`**: Provides a form for users to submit code for a specific problem. Upon submission, it now displays a toast notification confirming the submission and immediately redirects the user to the problem's submissions page, where they can see their submission appear with a "Queued" status.
*   **`Credits`**: Displays credits for the project, including contributors and technologies used.
*   **`Footer`**: Displays copyright information, links to About Us, Contact, and Privacy Policy pages.
*   **`AboutUs`**: Provides information about the Annaforces platform.
*   **`Contact`**: Provides contact details for Annaforces support.
*   **`PrivacyPolicy`**: Outlines the privacy policy of the Annaforces platform.
*   **`NotFound`**: Displays a 404 "Page Not Found" message, including the incorrect URL, and provides a link to the Welcome Page.
*   **`ProtectedRoute`**: A routing helper component that ensures only authenticated users can access certain routes.
*   **`ForgotPassword`**: Provides a form for users to request their User ID or initiate a password reset via OTP. Sends an OTP to the user's email for password reset requests. The OTP is discarded after 3 incorrect attempts.
*   **`ResetPassword`**: Allows users to reset their password by providing their email, the OTP received, and a new password.
*   **`Contests`**: Fetches and displays a list of all available contests from the backend. Each contest is a clickable link to its detail page.
*   **`ContestDetail`**: Displays the detailed information for a specific contest. It handles different states of the contest:
    *   If the contest has not started, it shows a message indicating that.
    *   If the user is not registered for an upcoming or running contest, it prompts them to register.
    *   If the contest is running, it displays the contest details, including the list of problems and a leaderboard with usernames.
    The component uses caching for both contest details and problem details to improve performance on subsequent visits. It also fetches problem details in parallel to reduce loading time.

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
*   `/users/:userId`: Displays the profile information for a specific user (protected route).
*   `/users/:userId/submissions`: Displays a list of all submissions for a specific user (protected route).
*   `/submissions/:submissionId`: Displays detailed information for a specific submission (protected route).
*   `/credits`: Displays the credits page (protected route).
*   `/contests`: Displays a list of all contests (protected route).
*   `/contests/:contestId`: Displays details for a specific contest (protected route).
*   `/about`: Displays information about the platform.
*   `/contact`: Displays contact information.
*   `/privacy`: Outlines the privacy policy of the Annaforces platform.
*   `/forgot-password`: Allows users to request their User ID or initiate a password reset via OTP.
*   `/reset-password`: Allows users to reset their password using an OTP.
*   Any other unmatched route redirects to `/login`.