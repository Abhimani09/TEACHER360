import React, { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../App.jsx";
import LessonReviewRow from "../components/LessonReviewRow.jsx";

export default function Lessons() {
  const auth = useAuth();
  const [lessons, setLessons] = useState([]);
  const [filter, setFilter] = useState("");

  const load = () => {
    client.get("/lessons", { params: filter ? { status: filter } : {} }).then((r) => setLessons(r.data));
  };

  useEffect(load, [filter]);

  const handleChanged = (updated) => {
    setLessons((prev) => prev.map((l) => (l._id === updated._id ? { ...l, ...updated } : l)));
  };

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Lesson Plans</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 160 }}>
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <table>
        <thead>
          <tr><th>Teacher</th><th>Subject</th><th>Week</th><th>Status</th></tr>
        </thead>
        <tbody>
          {lessons.map((l) => (
            <tr key={l._id}>
              <td>{l.teacher?.name}</td>
              <td>{l.subject}</td>
              <td>{l.week}</td>
              <td><LessonReviewRow lesson={l} onChanged={handleChanged} /></td>
            </tr>
          ))}
          {lessons.length === 0 && (
            <tr><td colSpan={4} style={{ color: "var(--sub)" }}>No lesson plans found.</td></tr>
          )}
        </tbody>
      </table>
      {!auth.isAdmin && (
        <div style={{ color: "var(--sub)", fontSize: 12, marginTop: 10 }}>
          Only admins can approve or reject submissions.
        </div>
      )}
    </div>
  );
}
