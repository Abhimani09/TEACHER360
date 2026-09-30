import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/teachers").then((r) => setTeachers(r.data));
  }, []);

  return (
    <div className="grid3">
      {teachers.map((t) => (
        <div key={t._id} className="tcard" onClick={() => navigate(`/teachers/${t._id}`)}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <div className="avatar">{initials(t.name)}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ color: "var(--sub)", fontSize: 12 }}>{t.department} · {t.role}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--sub)" }}>
            <span>Attendance</span><span>{t.attendance}%</span>
          </div>
          <div className="bar-bg"><div className="bar-fill" style={{ width: `${t.attendance}%` }} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--sub)" }}>
            <span>Performance</span><span>{t.performance}%</span>
          </div>
          <div className="bar-bg"><div className="bar-fill" style={{ width: `${t.performance}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
