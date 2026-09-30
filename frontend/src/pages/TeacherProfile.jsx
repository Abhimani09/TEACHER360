import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import { StatCard, StatusPill } from "../components/Bits.jsx";
import LessonReviewRow from "../components/LessonReviewRow.jsx";

export default function TeacherProfile({ ownId }) {
  const params = useParams();
  const id = ownId || params.id; // ownId set when a teacher views their own profile via /me
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const load = () => client.get(`/teachers/${id}`).then((r) => setData(r.data));
  useEffect(() => { if (id) load(); }, [id]);

  if (!data) return null;
  const { teacher, certs, lessons, feedback } = data;

  const handleChanged = (updated) => {
    setData((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) => (l._id === updated._id ? { ...l, ...updated } : l)),
    }));
  };

  return (
    <>
      {!ownId && <button className="back-link" onClick={() => navigate("/teachers")}>← Back to Teachers</button>}
      <div className="grid4">
        <StatCard n={`${teacher.attendance}%`} l="Attendance" />
        <StatCard n={`${teacher.punctuality}%`} l="Punctuality" />
        <StatCard n={`${teacher.trainingHoursCompleted}/${teacher.trainingHoursTarget}`} l="Training" />
        <StatCard n={`${teacher.performance}%`} l="Performance" />
      </div>
      <div className="row2">
        <div className="panel">
          <h3>Certifications</h3>
          {certs.length === 0 && <div style={{ color: "var(--sub)", fontSize: 13 }}>No certifications yet</div>}
          {certs.map((c) => (
            <div key={c._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span><b>{c.name}</b> — {new Date(c.completedDate).toLocaleDateString()}</span>
              <StatusPill status={c.verified ? "Verified" : "Pending"} />
            </div>
          ))}
          <h3 style={{ marginTop: 16 }}>Lesson Plans</h3>
          {lessons.map((l) => (
            <div key={l._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span>{l.subject} — {l.week}</span>
              <LessonReviewRow lesson={l} onChanged={handleChanged} />
            </div>
          ))}
        </div>
        <div className="panel">
          <h3>Feedback</h3>
          {feedback.length === 0 && <div style={{ color: "var(--sub)", fontSize: 13 }}>No feedback yet</div>}
          {feedback.map((f) => (
            <div key={f._id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>{f.categories?.join(", ")}</span>
                <span>{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</span>
              </div>
              <div style={{ color: "var(--sub)", fontSize: 12 }}>{f.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
