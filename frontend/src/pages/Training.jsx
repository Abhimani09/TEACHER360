import React, { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../App.jsx";
import { StatusPill } from "../components/Bits.jsx";

export default function Training() {
  const auth = useAuth();
  const [certs, setCerts] = useState([]);
  const load = () => client.get("/training").then((r) => setCerts(r.data));
  useEffect(() => { load(); }, []);

  const verify = async (id) => {
    await client.patch(`/training/${id}/verify`);
    load();
  };

  return (
    <div className="panel">
      <h3>Training & Certifications</h3>
      <table>
        <thead><tr><th>Teacher</th><th>Certification</th><th>Completed</th><th>Status</th>{auth.isAdmin && <th></th>}</tr></thead>
        <tbody>
          {certs.map((c) => (
            <tr key={c._id}>
              <td>{c.teacher?.name}</td>
              <td>{c.name}</td>
              <td>{new Date(c.completedDate).toLocaleDateString()}</td>
              <td><StatusPill status={c.verified ? "Verified" : "Pending"} /></td>
              {auth.isAdmin && (
                <td>{!c.verified && <button className="btn-approve" onClick={() => verify(c._id)}>Verify</button>}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
