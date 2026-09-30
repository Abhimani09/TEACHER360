import React, { useState } from "react";
import client from "../api/client";
import { useAuth } from "../App.jsx";
import { StatusPill } from "./Bits.jsx";

// Renders one lesson plan's status, plus Approve/Reject/Reset controls for admins.
// onChanged(updatedLesson) lets the parent update its local list without a refetch.
export default function LessonReviewRow({ lesson, onChanged }) {
  const auth = useAuth();
  const [busy, setBusy] = useState(false);

  const review = async (decision) => {
    setBusy(true);
    try {
      const { data } = await client.patch(`/lessons/${lesson._id}/review`, { decision });
      onChanged(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update lesson plan");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setBusy(true);
    try {
      const { data } = await client.patch(`/lessons/${lesson._id}/reset`);
      onChanged(data);
    } finally {
      setBusy(false);
    }
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <StatusPill status={lesson.status} />
      {auth.isAdmin && lesson.status === "Pending" && (
        <>
          <button className="btn-approve" disabled={busy} onClick={() => review("Approved")}>Approve</button>
          <button className="btn-reject" disabled={busy} onClick={() => review("Rejected")}>Reject</button>
        </>
      )}
      {auth.isAdmin && lesson.status !== "Pending" && (
        <button className="btn-reset" disabled={busy} onClick={reset}>Reset</button>
      )}
    </span>
  );
}
