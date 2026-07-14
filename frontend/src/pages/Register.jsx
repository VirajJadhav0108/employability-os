import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "student", skills: "", company: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const user = await register(payload);
      navigate(user.role === "student" ? "/internships" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Create your e-OS account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Full name" required style={inputStyle}
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" required style={inputStyle}
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password (min 6 chars)" required style={inputStyle}
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle}>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
          <option value="placement_admin">Placement Cell / Admin</option>
        </select>

        {form.role === "student" && (
          <input placeholder="Skills (comma-separated, e.g. React, Python, MongoDB)" style={inputStyle}
            value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        )}
        {form.role === "recruiter" && (
          <input placeholder="Company name" style={inputStyle}
            value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={btnStyle}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

const inputStyle = { display: "block", width: "100%", padding: 10, marginBottom: 12, border: "1px solid #cbd5e1", borderRadius: 6 };
const btnStyle = { width: "100%", padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };

export default Register;
