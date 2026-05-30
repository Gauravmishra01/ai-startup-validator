`# 🚀 AI Startup Validator

Validate, analyze, and score startup ideas with AI.

## Overview

This repo contains a React + Vite frontend and an Express + MongoDB backend. The app now includes a full authentication system with session-based login, bcrypt password hashing, CSRF protection, rate limiting, and protected idea routes scoped to the signed-in user.

## Features

- AI-driven startup analysis
- Profitability scoring from 0 to 100
- Risk level prediction
- Competitor and tech stack suggestions
- Session-based signup, login, logout, and refresh persistence
- Protected idea dashboards and idea detail routes
- CSRF, rate limiting, and input sanitization on protected endpoints

## Tech Stack

### Frontend

- React
- Vite
- TailwindCSS
- React Router
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Groq SDK
- bcryptjs
- express-session
- connect-mongo
- helmet
- custom session-based CSRF protection

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Gauravmishra01/ai-startup-validator.git
cd ai-startup-validator
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URI=your_mongo_connection_string
GROQ_API_KEY=your_groq_api_key
SESSION_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

Start the backend:

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

## Authentication Flow

- Users sign up with full name, email, password, and confirm password.
- Passwords are validated client-side and server-side, then hashed with bcrypt.
- Login creates a server session that persists after refresh.
- Logout destroys the session and clears the cookie.
- Protected routes redirect unauthenticated users to the login page.

## API Endpoints

### Auth

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/api/auth/csrf`   | Fetch a CSRF token             |
| POST   | `/api/auth/signup` | Create a new user              |
| POST   | `/api/auth/login`  | Log in with email and password |
| POST   | `/api/auth/logout` | Destroy the active session     |
| GET    | `/api/auth/me`     | Get the current signed-in user |

### Ideas

| Method | Endpoint        | Description                                 |
| ------ | --------------- | ------------------------------------------- |
| POST   | `/api/validate` | Analyze and save a startup idea             |
| GET    | `/ideas`        | List the signed-in user’s ideas             |
| GET    | `/ideas/:id`    | Fetch one idea owned by the signed-in user  |
| POST   | `/ideas`        | Create and analyze an idea                  |
| DELETE | `/ideas/:id`    | Delete one idea owned by the signed-in user |

## Deployment Notes

### Frontend

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to the deployed backend URL

### Backend

- Root directory: `server`
- Start command: `npm start`
- Set `MONGO_URI`, `GROQ_API_KEY`, `SESSION_SECRET`, and `CLIENT_ORIGIN`

## License

MIT
