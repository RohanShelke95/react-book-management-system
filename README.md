# Athena Book Management System

Athena is a clean, modern, and interactive React-based Book Management System that allows users to catalog their books, add new entries, update details, search by title/author, and filter by genre. It features a stunning modern glassmorphic interface, a fully automated dark mode, and proper loading and error boundaries.

The application communicates with a mock REST API backend built using **JSON Server**.

---

## Features

- **Full CRUD operations**: Easily add books, update details, view records, and remove books from the system.
- **Search & Filtering**: Real-time search of the collection by title or author, combined with quick-click genre filtering.
- **Rich Aesthetics**: Responsive layouts, glassmorphic modals, smooth transitions, float animations, and full dark-mode support.
- **Error Handling**: Graceful loading animations and automatic recovery banners when the backend API is unreachable.

---

## Tech Stack

- **Frontend**: React (v19), Vite, CSS Variables, Lucide Icons
- **Backend**: Node.js, JSON Server (Mock API)
- **Dev Tooling**: Nodemon, ESLint

---

## Local Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Clone or Download the Project
Ensure the project structure is as follows:
```text
book-management-system/
├── client/          # React frontend
└── server/          # JSON Server backend
```

### 2. Configure & Run the Backend Server
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Start the local server in development mode:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:5000`. It will serve data from the `db.json` file.

### 3. Configure & Run the Frontend Client
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open the displayed URL (typically `http://localhost:5173`) in your web browser.

---

## Deployment Guide

Once you are ready to make the application public, follow these instructions to host both components.

### 1. Deploy the Backend Server (e.g. Render)
Render is a popular free hosting service suitable for Node.js backends.

1. Create a free account at [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name**: `book-management-backend`
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Advanced**, add an Environment Variable:
   - `PORT` = `10000`
6. Deploy the Web Service. Copy your deployed service URL (e.g., `https://book-management-backend.onrender.com`).

### 2. Deploy the Frontend Client (e.g. Vercel)
Vercel is ideal for static React applications.

1. Create a free account at [Vercel](https://vercel.com/).
2. Select **Add New** > **Project** and import your GitHub repository.
3. In the project setup page, configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Under **Environment Variables**, add the API endpoint pointing to your deployed backend server:
   - Key: `VITE_API_URL`
   - Value: `https://book-management-backend.onrender.com/api` *(replace with your actual Render URL)*
5. Click **Deploy**. Vercel will build and provide a live URL for your client application!

---

## Git Operations & GitHub Repository Setup

To push this codebase to your own GitHub account:

1. Initialize a Git repository in the root directory:
   ```bash
   git init
   ```
2. Create a `.gitignore` file if not present:
   ```text
   node_modules/
   client/dist/
   .env
   ```
3. Stage and commit the files:
   ```bash
   git add .
   git commit -m "Initial commit: Book Management System"
   ```
4. Create a new repository on GitHub (do not initialize with README).
5. Link and push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
