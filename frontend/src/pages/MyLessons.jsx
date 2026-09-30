import React, { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../App.jsx";
import { StatusPill } from "../components/Bits.jsx";

// Teacher-facing page: submit a lesson plan and track its review status.
// This is what a teacher sees at /lessons — admins see the review queue (Lessons.jsx) instead.
export default function MyLessons() {
  const auth = useAuth();
  const [lessons, setLessons] = useState([]);
  const [subject, setSubject] = useState("");
  const [week, setWeek] = useState("");
  const [notes, setNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => client.get("/teachers/" + auth.user.id).then((r) => setLessons(r.data.lessons));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/lessons", { subject, week, notes, fileUrl });
      setSubject(""); setWeek(""); setNotes(""); setFileUrl("");
      load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row2">
      <form className="panel" onSubmit={submit}>
        <h3>Submit a Lesson Plan</h3>
        <div className="field"><label>Subject</label><input value={subject} onChange={(e) => setSubject(e.target.value)} required /></div>
        <div className="field"><label>Week</label><input value={week} onChange={(e) => setWeek(e.target.value)} placeholder="Week 04" required /></div>
        <div className="field"><label>File link (optional)</label><input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." /></div>
        <div className="field"><label>Notes</label><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <button className="btn-primary" disabled={submitting}>{submitting ? "Submitting…" : "Submit for Review"}</button>
      </form>
      <div className="panel">
        <h3>My Submissions</h3>
        {lessons.length === 0 && <div style={{ color: "var(--sub)", fontSize: 13 }}>Nothing submitted yet.</div>}
        {lessons.map((l) => (
          <div key={l._id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span>{l.subject} — {l.week}</span>
              <StatusPill status={l.status} />
            </div>
            {l.status === "Rejected" && l.reviewNote && (
              <div style={{ color: "var(--red)", fontSize: 12, marginTop: 2 }}>Reviewer note: {l.reviewNote}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
