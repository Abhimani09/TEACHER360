import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function Attendance() {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => { client.get("/teachers").then((r) => setTeachers(r.data)); }, []);

  return (
    <div className="panel">
      <h3>Attendance & Punctuality</h3>
      <table>
        <thead><tr><th>Teacher</th><th>Attendance</th><th>Punctuality</th></tr></thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.attendance}%</td>
              <td>{t.punctuality}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ color: "var(--sub)", fontSize: 12, marginTop: 10 }}>
        Daily present/late/absent records are stored per teacher via <code>POST /api/attendance</code> —
        wire up a calendar picker here to call that endpoint per day.
      </div>
    </div>
  );
}
