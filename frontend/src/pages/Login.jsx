import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(form);

      navigate(user.role === "admin" ? "/admin" : "/employee");
    } catch (err) {
      const data = err.response?.data;

      setError(
        data
          ? Object.values(data).flat().join(" ")
          : "Unable to connect to the server."
      );
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">M</div>
        <p className="eyebrow">MEETSPACE</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to access your workspace.</p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            placeholder="Enter username"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="Enter password"
            required
          />

          <button className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <p className="auth-bottom">
          New employee? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}