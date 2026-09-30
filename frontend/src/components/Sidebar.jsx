import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../App.jsx";

const ADMIN_ITEMS = [
  ["/", "🏠", "Dashboard"],
  ["/teachers", "👩‍🏫", "Teachers"],
  ["/attendance", "🕒", "Attendance"],
  ["/training", "🎓", "Training & Certs"],
  ["/feedback", "💬", "Feedback"],
  ["/lessons", "📚", "Lesson Plans"],
  ["/analytics", "📊", "Analytics"],
  ["/leaderboard", "🏆", "Leaderboard"],
];

// Teachers get their own, narrower nav — no org-wide admin views.
const TEACHER_ITEMS = [
  ["/", "🏠", "My Dashboard"],
  ["/me", "🙍", "My Profile"],
  ["/lessons", "📚", "My Lesson Plans"],
  ["/leaderboard", "🏆", "Leaderboard"],
];

export default function Sidebar() {
  const auth = useAuth();
  const ITEMS = auth.isAdmin ? ADMIN_ITEMS : TEACHER_ITEMS;
  return (
    <div className="sidebar">
      <div className="logo" style={{ padding: "6px 8px 18px" }}>NEXENTIA</div>
      {ITEMS.map(([to, icon, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          {icon} {label}
        </NavLink>
      ))}
    </div>
  );
}
