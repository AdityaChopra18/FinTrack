# FinTrack

A full-stack personal finance tracking application built with the PERN stack (PostgreSQL, Express, React, Node.js).

## Features

- **Dashboard**: Overview of total balance, income, expenses, and expense breakdown.
- **Transactions**: Add, edit, delete, and view income/expense transactions.
- **Budgets**: Set and monitor monthly budgets for different categories.
- **Savings Goals**: Create savings goals, track target dates, and log contributions.

## Prerequisites

- Node.js (v16+)
- Neon Serverless PostgreSQL Database (or any PostgreSQL instance)

## Local Setup

### 1. Database Setup (Neon)

1. Create a project on [Neon](https://neon.tech/).
2. Copy the connection string (`DATABASE_URL`).
3. Connect to the database and run the schema script found in `backend/schema.sql` to create the required tables.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your `DATABASE_URL`.
5. Start the backend server:
   ```bash
   npm run start
   ```
   (Server runs on http://localhost:5000)

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render)

1. Connect your GitHub repository to [Render](https://render.com/).
2. Render will automatically detect the `render.yaml` file in the root directory.
3. Configure the `DATABASE_URL` environment variable in the Render dashboard during setup.

### Frontend (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. Import the project and set the **Root Directory** to `frontend`.
3. Set the Framework Preset to **Vite**.
4. In Environment Variables, add `VITE_API_URL` and point it to your deployed Render backend URL (e.g., `https://fintrack-backend.onrender.com/api`).
5. Deploy.
