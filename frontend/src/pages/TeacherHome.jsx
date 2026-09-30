import React, { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../App.jsx";
import { StatCard, StatusPill } from "../components/Bits.jsx";

// Landing page for teachers after login — their own numbers only, not the org-wide admin view.
export default function TeacherHome() {
  const auth = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (auth.user?.id) client.get(`/teachers/${auth.user.id}`).then((r) => setData(r.data));
  }, [auth.user]);

  if (!data) return null;
  const { teacher, lessons, certs, feedback } = data;
  const pending = lessons.filter((l) => l.status === "Pending").length;

  return (
    <>
      <div className="grid4">
        <StatCard n={`${teacher.attendance}%`} l="Attendance" />
        <StatCard n={`${teacher.performance}%`} l="Performance" />
        <StatCard n={`${teacher.trainingHoursCompleted}/${teacher.trainingHoursTarget}`} l="Training Hours" />
        <StatCard n={pending} l="Lessons Pending Review" />
      </div>
      <div className="row2">
        <div className="panel">
          <h3>My Lesson Plans</h3>
          {lessons.length === 0 && <div style={{ color: "var(--sub)", fontSize: 13 }}>You haven't submitted any lesson plans yet.</div>}
          {lessons.slice(0, 5).map((l) => (
            <div key={l._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span>{l.subject} — {l.week}</span>
              <StatusPill status={l.status} />
            </div>
          ))}
          <a href="/lessons" style={{ color: "var(--purple)", fontSize: 12 }}>Submit or view all →</a>
        </div>
        <div className="panel">
          <h3>Recent Feedback</h3>
          {feedback.length === 0 && <div style={{ color: "var(--sub)", fontSize: 13 }}>No feedback yet.</div>}
          {feedback.slice(0, 5).map((f) => (
            <div key={f._id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12 }}>{f.categories?.join(", ")} · {"★".repeat(f.rating)}</div>
              <div style={{ color: "var(--sub)", fontSize: 12 }}>{f.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
