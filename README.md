# AI Interview Preparation Platform

## Overview

This project is a sophisticated, full-stack application designed to empower job seekers in their technical interview preparation by leveraging the power of Google's Gemini AI. It moves beyond generic interview advice by providing personalized, role-specific feedback and a structured study plan.

The core of the application lies in its ability to analyze a user's resume, their personal summary, and a target job description. From these inputs, it generates a comprehensive interview preparation report that includes a "match score," tailored technical and behavioral questions, an analysis of skill gaps, and a customized, day-by-day preparation guide.

## High-Level Architecture

```
  +----------------+      +----------------+      +-----------------+
  |   React (Vite) |      |   Node/Express |      |   MongoDB       |
  |    Frontend    |----->|    Backend     |----->|   (Mongoose)    |
  +----------------+      |      API       |      +-----------------+
                          +-------+--------+
                                  |
                                  |
                          +-------v--------+
                          |  Google Gemini |
                          |      AI        |
                          +----------------+
```

## Features

- **AI-Powered Analysis:** Utilizes Google's Gemini AI to generate personalized interview preparation reports.
- **Secure User Authentication:** Robust user registration and login system using JSON Web Tokens (JWT) for secure, session-based access.
- **Dynamic Report Generation:** On-the-fly creation of detailed interview reports based on user-provided resume, self-description, and job description.
- **Personalized User Dashboard:** A central hub for users to view, manage, and track their history of generated interview reports.
- **Resume Upload & Parsing:** Seamlessly handles PDF resume uploads for in-depth analysis.
- **Data-Driven Insights:** Provides a quantitative "Match Score," identifies specific skill gaps, and suggests both technical and behavioral questions relevant to the target role.
- **Actionable Study Plan:** Generates a structured, day-by-day preparation plan to help users address identified weaknesses effectively.

## Technologies Used

| Category          | Technology                |
| ----------------- | ------------------------- |
| **Backend**       | Node.js, Express.js       |
| **Frontend**      | React, Vite, React Router |
| **Database**      | MongoDB (with Mongoose)   |
| **AI**            | Google Gemini             |
| **Styling**       | Tailwind CSS              |
| **API Client**    | Axios                     |
| **Auth**          | JSON Web Tokens (JWT)     |
| **Validation**    | Zod                       |
| **File Handling** | Multer, pdf-parse         |

## Gemini AI Integration

The AI integration is a cornerstone of this platform, powered by the `@google/genai` SDK. The process is as follows:

1.  **Model Selection:** The `gemini-2.5-flash` model is used for its speed and advanced reasoning capabilities.
2.  **Input Aggregation:** User data, including the parsed text from their resume, a self-description, and the target job description, is collected.
3.  **Prompt Engineering:** A detailed, multi-part prompt is constructed. It instructs the AI to act as an expert technical recruiter and provides the aggregated user data as context.
4.  **Structured Output (Function Calling):** To ensure a reliable and structured output, Gemini's "Function Calling" feature is used. A JSON schema is defined and passed with the prompt, compelling the AI to return a JSON object that strictly adheres to the predefined structure. This eliminates the need for fragile string parsing and ensures data consistency.
5.  **Response Generation:** The AI analyzes the provided data and generates a JSON response containing:
    - `matchScore`: A percentage indicating the candidate's fit for the role.
    - `technicalQuestions`: A list of potential technical questions with their intent and expected answers.
    - `behavioralQuestions`: A list of potential behavioral questions with their intent and expected answers.
    - `skillGaps`: A list of identified skill gaps and their severity.
    - `preparationPlan`: A day-by-day study plan to address the identified gaps.
6.  **Data Validation:** The AI's JSON response is then validated using `zod` against a strict schema (`interviewReportSchema`) on the backend. This ensures data integrity before it is sent to the frontend or stored in the database.
7.  **Database Persistence:** The validated report, along with the user's original inputs, is saved to the MongoDB database, linked to the user's account.

## API Documentation

The backend exposes a RESTful API for the frontend to consume.

### Authentication Routes

| Method | Endpoint             | Description                                | Access  |
| ------ | -------------------- | ------------------------------------------ | ------- |
| `POST` | `/api/auth/register` | Register a new user.                       | Public  |
| `POST` | `/api/auth/login`    | Log in an existing user and get a token.   | Public  |
| `GET`  | `/api/auth/logout`   | Log out the user and invalidate the token. | Private |
| `GET`  | `/api/auth/get-me`   | Get the currently logged-in user's data.   | Private |

### Interview Routes

| Method | Endpoint                      | Description                                                                                                       | Access  |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| `POST` | `/api/interview`              | Generate a new interview report. Requires `resume` (file), `selfDescription` (text), and `jobDescription` (text). | Private |
| `GET`  | `/api/interview`              | Get all interview reports for the logged-in user (summary view).                                                  | Private |
| `GET`  | `/api/interview/:interviewId` | Get a specific, detailed interview report by its ID.                                                              | Private |

#### Example: Generate Interview Report

- **Endpoint:** `POST /api/interview`
- **Content-Type:** `multipart/form-data`
- **Auth:** Requires JWT Bearer token.
- **Form Fields:**
  - `resume`: (file) The user's PDF resume.
  - `jobDescription`: (text) The full text of the job description.
  - `selfDescription`: (text) A brief summary from the user.

- **Success Response (201 Created):**

  ```json
  {
    "message": "Interview report generated successfully.",
    "interviewReport": {
      "user": "60d5ecb4bcf42a001f8e4bde",
      "title": "Senior Software Engineer",
      "matchScore": 85,
      "technicalQuestions": [
        {
          "question": "Explain the event loop in Node.js.",
          "intent": "To assess understanding of Node.js concurrency model.",
          "expectedAnswer": "..."
        }
      ],
      // ... other fields
      "_id": "60d5f0a8bcf42a001f8e4be0",
      "createdAt": "2023-10-27T10:00:00.000Z"
    }
  }
  ```

## Project Structure

The project is organized into two main directories: `Backend` and `Frontend`.

### Backend (`/Backend`)

```
Backend/
├── src/
│   ├── controllers/    # Handles request/response logic
│   │   ├── auth.controller.js
│   │   └── interview.controller.js
│   ├── middlewares/    # Express middlewares (e.g., auth)
│   │   └── auth.middleware.js
│   ├── models/         # Mongoose schemas and models
│   │   ├── user.model.js
│   │   └── interviewReport.model.js
│   ├── routes/         # API route definitions
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   ├── services/       # Business logic (e.g., AI interaction)
│   │   └── ai.service.js
│   ├── utils/          # Utility functions
│   └── app.js          # Main Express application setup
├── .env                # Environment variables
└── package.json
```

### Frontend (`/Frontend`)

```
Frontend/
├── src/
│   ├── assets/         # Static assets (images, svgs)
│   ├── components/     # Reusable React components
│   ├── context/        # React context for global state
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page-level components
│   ├── services/       # API call functions (Axios)
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Application entry point
├── .env.local          # Frontend environment variables
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v20.x or higher recommended)
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- Google Gemini API Key

### Backend Setup

1.  **Navigate to the backend directory:** `cd Backend`
2.  **Install dependencies:** `npm install`
3.  **Create an environment file:** Create a `.env` file in the `Backend` root and add the following variables:
    ```
    PORT=8000
    MONGO_URI=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_JWT_Secret_Key>
    GEMINI_API_KEY=<Your_Google_Gemini_API_Key>
    ```
4.  **Start the server:** `npm run dev`

### Frontend Setup

1.  **Navigate to the frontend directory:** `cd Frontend`
2.  **Install dependencies:** `npm install`
3.  **Create an environment file:** Create a `.env.local` file in the `Frontend` root. This is used by Vite to expose variables to the client-side code.
    ```
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
4.  **Start the development server:** `npm run dev`
5.  Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeatureName`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
