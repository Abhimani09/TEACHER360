import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import client from "../api/client";
import { StatCard } from "../components/Bits.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    client.get("/teachers/dashboard-stats").then((r) => setStats(r.data));
    client.get("/teachers").then((r) => setTeachers(r.data));
  }, []);

  const deptData = Object.values(
    teachers.reduce((acc, t) => {
      acc[t.department] = acc[t.department] || { name: t.department, total: 0, count: 0 };
      acc[t.department].total += t.performance;
      acc[t.department].count += 1;
      return acc;
    }, {})
  ).map((d) => ({ name: d.name, performance: Math.round(d.total / d.count) }));

  return (
    <>
      <div className="grid4">
        <StatCard n={stats?.teacherCount ?? "—"} l="Teachers" />
        <StatCard n={stats ? `${stats.avgAttendance}%` : "—"} l="Avg Attendance" />
        <StatCard n={stats?.totalCerts ?? "—"} l="Certifications" />
        <StatCard n={stats?.pendingLessons ?? "—"} l="Pending Reviews" />
      </div>
      <div className="row2">
        <div className="panel">
          <h3>Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={teachers.map((t, i) => ({ name: t.name.split(" ")[0], attendance: t.attendance }))}>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[70, 100]} />
              <Tooltip contentStyle={{ background: "#181b2e", border: "1px solid #2a2f4a" }} />
              <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h3>Department-wise Performance</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={deptData}>
              <XAxis dataKey="name" tick={{ fill: "#8b8fb3", fontSize: 10 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#181b2e", border: "1px solid #2a2f4a" }} />
              <Bar dataKey="performance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
