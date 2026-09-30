import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App.jsx";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@nexentia.lk");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await auth.login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="logo">NEXENTIA</div>
        <div className="tagline">Teacher Performance & Development</div>
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn-primary" type="submit">Sign in</button>
          {error && <div className="error">{error}</div>}
        </form>
        <div style={{ color: "var(--sub)", fontSize: 11, marginTop: 14, textAlign: "center" }}>
          Seeded accounts: admin@nexentia.lk / admin123 · sarah.perera@nexentia.lk / teacher123
        </div>
      </div>
    </div>
  );
}
