import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App.jsx";

export default function Topbar({ title, sub }) {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div>
        <h1 style={{ margin: 0, fontSize: 20 }}>{title || `Good morning, ${auth.user?.name?.split(" ")[0] || ""} 👋`}</h1>
        <div style={{ color: "var(--sub)", fontSize: 13 }}>{sub || "Here's what's happening with your teaching staff."}</div>
      </div>
      <button className="logout" onClick={() => { auth.logout(); navigate("/login"); }}>Log out</button>
    </div>
  );
}
