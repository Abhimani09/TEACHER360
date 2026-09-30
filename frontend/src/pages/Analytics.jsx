import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import client from "../api/client";

export default function Analytics() {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => { client.get("/teachers").then((r) => setTeachers(r.data)); }, []);

  const chartData = teachers.map((t) => ({
    name: t.name.split(" ")[0],
    performance: t.performance,
    training: Math.round((t.trainingHoursCompleted / t.trainingHoursTarget) * 100),
  }));

  return (
    <div className="row2">
      <div className="panel">
        <h3>Performance Scores</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fill: "#8b8fb3", fontSize: 10 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#181b2e", border: "1px solid #2a2f4a" }} />
            <Bar dataKey="performance" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <h3>Training Progress</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fill: "#8b8fb3", fontSize: 10 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#181b2e", border: "1px solid #2a2f4a" }} />
            <Bar dataKey="training" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
