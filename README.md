# Bouldering Gym - React Frontend

A React single-page application for managing a bouldering gym. Members can view climbing routes, log attempts, like routes, and book coaching sessions. Admins can manage routes, sessions, and memberships.

## Live Demo

**Frontend**: https://splendid-bombolone-82d169.netlify.app

## Tech Stack

- **React** with Vite
- **Redux Toolkit** for global state management
- **React Router** for client-side navigation
- **React Bootstrap** for UI components
- **Axios** for API requests
- **JWT** authentication via `jwt-decode`

## Getting Started

### Prerequisites
- Node.js
- The backend API running (see backend repo for setup)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joshashman/BoulderingGymAPIFrontend
cd BoulderingGymAPIFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root:
VITE_API_URL=https://joshboulderinggymapi-f4cghahvbxhrhycn.swedencentral-01.azurewebsites.net/api
Or if running the backend locally:
VITE_API_URL=https://localhost:7001/api

4. Start the development server:
```bash
npm run dev
```

## Backend API

This frontend consumes the Bouldering Gym ASP.NET Core Web API.

- **Backend Repository**: https://github.com/joshashman/BoulderingGymAPI
- **Live API**: https://joshboulderinggymapi-f4cghahvbxhrhycn.swedencentral-01.azurewebsites.net
- **Swagger Docs**: https://joshboulderinggymapi-f4cghahvbxhrhycn.swedencentral-01.azurewebsites.net/swagger

## Features

### All Users
- View climbing routes with difficulty, location, set and strip dates
- Register and log in

### Logged In Users
- Like climbing routes
- Log route attempts
- View and cancel bookings
- Browse coaching sessions
- View personal dashboard with recent attempts, bookings and liked routes

### Admin Only
- Create and delete climbing routes
- Create and delete coaching sessions
- Manage memberships
- View all bookings and membership overview on dashboard

## Roles
- **User** — default role assigned on registration
- **Admin** — elevated access to management features

## Testing

Run the unit tests:
```bash
npm test
```

Tests cover:
- `ProtectedRoute` — authentication and role based access
- `Navbar` — correct links shown based on auth state
- `LoginPage` — form rendering and input handling

## Deployment

Deployed on **Netlify** with automatic deployments triggered by pushes to the `main` branch on GitHub.
