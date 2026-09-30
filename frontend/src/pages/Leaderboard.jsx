import React, { useEffect, useState } from "react";
import client from "../api/client";

const MEDALS = ["🥇", "🥈", "🥉"];

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default function Leaderboard() {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => { client.get("/teachers").then((r) => setTeachers(r.data)); }, []);

  const sorted = [...teachers].sort((a, b) => b.xp - a.xp);
  const max = sorted[0]?.xp || 1;

  return (
    <div className="panel">
      <h3>🏆 Professional Growth</h3>
      {sorted.map((t, i) => (
        <div key={t._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 6px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 28, textAlign: "center", fontWeight: 700 }}>{MEDALS[i] || i + 1}</div>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{initials(t.name)}</div>
          <div style={{ width: 140 }}>{t.name}</div>
          <div style={{ flex: 1, height: 8, background: "var(--bg2)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(t.xp / max) * 100}%`, background: "var(--grad)" }} />
          </div>
          <div style={{ width: 70, textAlign: "right" }}>{t.xp} XP</div>
        </div>
      ))}
    </div>
  );
}
