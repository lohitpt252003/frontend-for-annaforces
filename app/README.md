# frontend-for-annaforces

This is the frontend for the Annaforces project, built with React.



## Data Structure

For a detailed understanding of how problems, submissions, users, and solutions are structured and stored, please refer to the [DATA/README.md](../DATA/README.md) file.

## Project Structure

The main frontend application is located in the `frontend-for-annaforces/app` directory.

## Getting Started

To run the frontend application:

1.  Navigate to the `frontend-for-annaforces/app` directory in your terminal.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  **Configure API Base URL:**
    Create a `.env` file in the `frontend-for-annaforces/app` directory and add the following line, replacing `YOUR_BACKEND_API_BASE_URL` with the actual URL of your backend API (e.g., `http://localhost:5000`):
    ```
    REACT_APP_API_BASE_URL=YOUR_BACKEND_API_BASE_URL
    ```
4.  Start the development server:
    ```bash
    npm start
    ```
    The application will typically open in your browser at `http://localhost:3000`.

## ... (rest of the content remains the same) ...

### Routing

*   `/`: Redirects to `/welcome` if logged in, or `/login` if not.
*   `/login`: Displays the login form.
*   `/signup`: Displays the signup form.
*   `/verify-otp/:email`: Allows users to verify their email with an OTP.
*   `/welcome`: Displays the welcome message for logged-in users.
*   `/contests`: Displays a list of all contests (protected route).
*   `/contests/:contestId`: Displays details for a specific contest (protected route).
*   `/contests/:contestId/problems/:problemId`: Displays details for a specific problem (protected route).
*   `/contests/:contestId/problems/:problemId/submit`: Provides a form for submitting code to a specific problem (protected route).
*   `/contests/:contestId/problems/:problemId/submissions`: Displays a list of all submissions for a specific problem (protected route).
*   `/contests/:contestId/problems/:problemId/solution`: Displays the solution code and explanation for a specific problem (protected route).
*   `/users/:username`: Displays the profile information for a specific user (protected route).
*   `/users/:username/submissions`: Displays a list of all submissions for a specific user (protected route).
*   `/submissions/:submissionId`: Displays detailed information for a specific submission (protected route).
*   `/credits`: Displays the credits page (protected route).
*   `/about`: Displays information about the platform.
*   `/contact`: Displays contact information.
*   `/privacy`: Outlines the privacy policy of the Annaforces platform.
*   `/forgot-password`: Allows users to request their Username or initiate a password reset via OTP.
*   `/reset-password`: Allows users to reset their password using an OTP.
*   Any other unmatched route redirects to `/login`.