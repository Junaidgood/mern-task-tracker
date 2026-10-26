# MERN Task Tracker

A full-stack Task Tracker application built with React, Node.js, Express, Mongoose, and MongoDB.

---

## 🚀 Features

- **Full CRUD Operations**:
  - **Create**: Add new tasks with client-side & server-side blank title validation.
  - **Read**: Fetch paginated task list (sorted by latest).
  - **Update**: Toggle task completion status (`completed: true/false`).
  - **Delete**: Remove tasks from database.
- **Pagination**: Configured for 5 tasks per page (`page` & `limit`) with Next/Previous navigation controls.
- **UI States**: Explicit handling for **Loading**, **Error**, and **Empty** states in React.
- **Architecture**:
  - **Backend**: Clean MVC architecture (Controllers, Models, Routes, Centralized Error Handling).
  - **Frontend**: Component-based architecture with separated API Service layer (`taskService.js`).

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Pure CSS, native `fetch` API.
- **Backend**: Node.js, Express.
- **Database**: MongoDB with Mongoose ODM.
- **Tools**: dotenv, cors.

---

## 📋 API Contract

| HTTP Method | Endpoint | Query / Body | Success Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | `?page=1&limit=5` | `200 OK` | Returns paginated task array & metadata |
| `POST` | `/api/tasks` | `{"title": "..."}` | `201 Created` | Saves new task document |
| `PATCH` | `/api/tasks/:id` | `{"completed": true}` | `200 OK` | Updates task status |
| `DELETE` | `/api/tasks/:id` | Param: `id` | `204 No Content`| Deletes task (no body) |

### Error Status Codes:
- `400 Bad Request`: Blank task title or invalid ID format.
- `404 Not Found`: Task not found or non-existent route.
- `500 Internal Server Error`: Unexpected server/database exceptions.

---

## 💻 Local Setup & Run Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `backend/` directory (refer to `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/mern_task_tracker
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   Server will start on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`.

---

## 🧪 Verification & Testing Completed

- [x] Tested `GET /api/tasks` with empty database and populated data.
- [x] Verified blank title rejection with `400` status on both client and server.
- [x] Verified task toggle persistence across page reloads.
- [x] Verified deletion with `204 No Content`.
- [x] Verified pagination limit (5 items/page) and disabled button states on boundaries.
- [x] Verified error banner when backend is offline.
