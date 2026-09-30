import React, { createContext, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import client from "./api/client";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TeacherHome from "./pages/TeacherHome.jsx";
import Teachers from "./pages/Teachers.jsx";
import TeacherProfile from "./pages/TeacherProfile.jsx";
import Attendance from "./pages/Attendance.jsx";
import Training from "./pages/Training.jsx";
import Feedback from "./pages/Feedback.jsx";
import Lessons from "./pages/Lessons.jsx";
import MyLessons from "./pages/MyLessons.jsx";
import Analytics from "./pages/Analytics.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("nexentia_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    localStorage.setItem("nexentia_token", data.token);
    localStorage.setItem("nexentia_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("nexentia_token");
    localStorage.removeItem("nexentia_user");
    setUser(null);
  };

  return { user, login, logout, isAdmin: user?.userType === "admin" };
}

function Protected({ children, adminOnly }) {
  const auth = useAuth();
  if (!auth.user) return <Navigate to="/login" replace />;
  if (adminOnly && !auth.isAdmin) return <Navigate to="/" replace />;
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        {children}
      </div>
    </div>
  );
}

// "/" and "/lessons" render different components depending on role,
// since teachers and admins need different views on the same URL.
function RoleHome() {
  const auth = useAuth();
  return auth.isAdmin ? <Dashboard /> : <TeacherHome />;
}
function RoleLessons() {
  const auth = useAuth();
  return auth.isAdmin ? <Lessons /> : <MyLessons />;
}
function MyProfile() {
  const auth = useAuth();
  return <TeacherProfile ownId={auth.user?.id} />;
}

export default function App() {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      <Routes>
        <Route path="/login" element={auth.user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={<Protected><RoleHome /></Protected>} />
        <Route path="/me" element={<Protected><MyProfile /></Protected>} />
        <Route path="/teachers" element={<Protected adminOnly><Teachers /></Protected>} />
        <Route path="/teachers/:id" element={<Protected adminOnly><TeacherProfile /></Protected>} />
        <Route path="/attendance" element={<Protected adminOnly><Attendance /></Protected>} />
        <Route path="/training" element={<Protected adminOnly><Training /></Protected>} />
        <Route path="/feedback" element={<Protected adminOnly><Feedback /></Protected>} />
        <Route path="/lessons" element={<Protected><RoleLessons /></Protected>} />
        <Route path="/analytics" element={<Protected adminOnly><Analytics /></Protected>} />
        <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}
