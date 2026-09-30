import React from "react";

export function StatCard({ n, l }) {
  return (
    <div className="stat-card">
      <div className="n">{n}</div>
      <div className="l">{l}</div>
    </div>
  );
}

const PILL_COLOR = { Approved: "g", Verified: "g", Pending: "y", Rejected: "r" };

export function StatusPill({ status }) {
  return <span className={`pill ${PILL_COLOR[status] || "y"}`}>{status}</span>;
}
