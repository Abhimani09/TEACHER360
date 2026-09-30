# NEXENTIA — Teacher Performance & Development Tracker

Full-stack scaffold: **React (Vite) + Node/Express + MongoDB (Mongoose)**.

## Structure
```
backend/    Express API, MongoDB models, JWT auth
frontend/   React app (Vite), React Router, Recharts, dark theme matching the demo
```

## Roles — admin vs teacher
Login returns a JWT with `userType: "admin" | "teacher"`, and the **frontend routes differently per role**:

- **Admin** → full console: org-wide Dashboard, Teachers grid, Attendance, Training verification,
  Feedback submission, **Lesson Plan review queue with Approve / Reject**, Analytics, Leaderboard.
- **Teacher** → their own space only: a personal Dashboard (`TeacherHome.jsx`), their own read-only
  Profile (`/me`), a **lesson plan submission form + their own submission statuses** (`MyLessons.jsx`),
  and the Leaderboard. Admin-only routes (`/teachers`, `/attendance`, `/training`, `/feedback`,
  `/analytics`) redirect a teacher back to `/` if they hit the URL directly.

Both roles hit the *same* `/lessons` URL — `RoleLessons` in `App.jsx` decides which component renders
based on `auth.isAdmin`, so it's one nav slot but two different screens.

## Lesson plan approve/reject flow
- Teacher: `POST /api/lessons` creates a plan with `status: "Pending"`.
- Admin: `PATCH /api/lessons/:id/review` with `{ decision: "Approved" | "Rejected", reviewNote? }`
  (protected by `requireAdmin`). `PATCH /api/lessons/:id/reset` undoes a decision.
- `LessonReviewRow.jsx` is the one shared component that renders the status pill + Approve/Reject/Reset
  buttons (buttons only appear for admins), used on both the admin review table and a teacher's profile.

## Setup

### Backend
```bash
cd backend
cp .env.example .env      # set MONGO_URI, JWT_SECRET
npm install
npm run seed               # creates admin + 4 sample teachers + sample data
npm run dev                 # http://localhost:5000
```
Seeded logins: `admin@nexentia.lk` / `admin123` and `sarah.perera@nexentia.lk` / `teacher123`
(all seeded teachers use password `teacher123`).

### Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```
Set `VITE_API_URL` in a `.env` file if your API isn't on `http://localhost:5000/api`.

## Deploying
- **Backend**: Render/Railway/Fly, or Vercel serverless functions (would need adapting from a long-running Express server). Use MongoDB Atlas for the database.
- **Frontend**: Vercel — set `VITE_API_URL` to your deployed backend's `/api` URL in the Vercel project's env vars.

## What's stubbed vs. built out
Fully wired: auth, dashboard stats, teacher list/profile, lesson plan submit + approve/reject/reset,
certification verify, feedback submit/list, leaderboard/XP display, role-based routing.
Left as a light stub for you to extend: a calendar UI for daily attendance marking (the API endpoint
`POST /api/attendance` already exists), and XP/badge auto-calculation rules (currently seeded values —
hook this into lesson-approval / attendance / training events once you decide the scoring formula).
