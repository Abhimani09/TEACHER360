import React, { useEffect, useState } from "react";
import client from "../api/client";

const CATEGORY_OPTIONS = ["Teaching Quality", "Classroom Management", "Professional Development"];

export default function Feedback() {
  const [teachers, setTeachers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [categories, setCategories] = useState([CATEGORY_OPTIONS[0]]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadEntries = () => client.get("/feedback").then((r) => setEntries(r.data));

  useEffect(() => {
    client.get("/teachers").then((r) => {
      setTeachers(r.data);
      if (r.data[0]) setTeacherId(r.data[0]._id);
    });
    loadEntries();
  }, []);

  const toggleCategory = (cat) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const submit = async (e) => {
    e.preventDefault();
    await client.post("/feedback", { teacher: teacherId, categories, rating, comment });
    setComment("");
    loadEntries();
  };

  return (
    <div className="row2">
      <form className="panel" onSubmit={submit}>
        <div className="field">
          <label>Teacher</label>
          <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
            {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Category</label>
          {CATEGORY_OPTIONS.map((cat) => (
            <label key={cat} style={{ display: "block", fontSize: 13, color: "var(--sub)", marginBottom: 4 }}>
              <input type="checkbox" checked={categories.includes(cat)} onChange={() => toggleCategory(cat)} /> {cat}
            </label>
          ))}
        </div>
        <div className="field">
          <label>Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Comments</label>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button className="btn-primary" type="submit">Submit Feedback</button>
      </form>
      <div className="panel">
        <h3>Recent Feedback</h3>
        {entries.map((f) => (
          <div key={f._id} style={{ marginBottom: 10 }}>
            <b style={{ fontSize: 13 }}>{f.teacher?.name}</b>
            <div style={{ fontSize: 12, color: "var(--sub)" }}>{f.categories?.join(", ")} · {"★".repeat(f.rating)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
