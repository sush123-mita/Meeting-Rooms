import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(form);
      setSuccess("Account created successfully. Please sign in.");

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const data = err.response?.data;

      setError(
        data
          ? Object.values(data).flat().join(" ")
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">M</div>
        <p className="eyebrow">MEETSPACE</p>
        <h1>Create account.</h1>
        <p className="muted">Register as an employee.</p>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <label>Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="primary-button" disabled={loading}>
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>

        <p className="auth-bottom">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}