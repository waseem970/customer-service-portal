# Customer Service Portal

A React-based insurance customer service portal with authentication, routing, and dashboard functionality.

## Features

### Authentication
- Login with email and password
- Session persistence using localStorage
- Protected routes with automatic redirection
- Logout functionality

### Demo Credentials
- **Email:** waseem@gmail.com
- **Password:** 1234

### Dashboard Layout
- Responsive sidebar navigation
- Header with user profile and logout
- Dynamic content rendering based on navigation

### Navigation Menu
- **Policy:** View and manage insurance policies
- **Claims:** Submit and track insurance claims
- **Billing:** Manage billing and payment information

## Technical Stack

- **React 19** with TypeScript
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the application
4. Use the demo credentials to log in

## Project Structure

```
src/
├── components/
│   └── Dashboard.tsx          # Main dashboard layout
├── Layout/
│   ├── Header.tsx            # Top navigation header
│   └── Sidebar.tsx           # Side navigation menu
├── Pages/
│   ├── Login.tsx             # Authentication page
│   ├── Policy.tsx            # Policy management
│   ├── Claims.tsx            # Claims management
│   └── Billing.tsx           # Billing management
└── App.jsx                   # Main application component
```

## Authentication Flow

1. User visits the application
2. If not authenticated, redirected to `/login`
3. User enters credentials (waseem@gmail.com / 1234)
4. On successful login, redirected to `/dashboard`
5. User can navigate between different sections
6. Logout clears session and redirects to login

## Routing Structure

- `/` - Redirects to login or dashboard based on auth status
- `/login` - Authentication page
- `/dashboard/*` - Protected dashboard routes
  - `/dashboard/policy` - Policy management
  - `/dashboard/claims` - Claims management
  - `/dashboard/billing` - Billing management

## State Management

- Authentication state managed in App component
- User data persisted in localStorage
- Route protection with conditional rendering
- Clean state handling for login/logout flows
