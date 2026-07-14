import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { socket } from "../utils/socket";

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [form, setForm] = useState({ title: "", company: "", description: "", requiredSkills: "" });
  const [message, setMessage] = useState("");

  const fetchInternships = () => {
    api.get("/internships?status=open").then((res) => setInternships(res.data));
  };

  useEffect(() => {
    fetchInternships();
    // Real-time: new postings appear instantly without a refresh.
    socket.on("internship:new", () => fetchInternships());
    return () => socket.off("internship:new");
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    await api.post("/internships", {
      ...form,
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setForm({ title: "", company: "", description: "", requiredSkills: "" });
    fetchInternships();
  };

  const handleApply = async (internshipId) => {
    try {
      await api.post("/applications", { internshipId });
      setMessage("Application submitted!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not apply");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h2>{user.role === "recruiter" ? "Manage Your Postings" : "Open Internships"}</h2>

      {user.role === "recruiter" && (
        <form onSubmit={handlePost} style={{ marginBottom: 24, padding: 16, border: "1px solid #e2e8f0", borderRadius: 8 }}>
          <h3>Post a new internship</h3>
          <input placeholder="Title" required style={inputStyle} value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Company" required style={inputStyle} value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <textarea placeholder="Description" required style={inputStyle} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Required skills (comma-separated)" required style={inputStyle}
            value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
          <button type="submit" style={btnStyle}>Post Internship</button>
        </form>
      )}

      {message && <p style={{ color: "#16a34a" }}>{message}</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {internships.map((i) => (
          <div key={i._id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
            <h3>{i.title} — {i.company}</h3>
            <p>{i.description}</p>
            <p><b>Skills:</b> {i.requiredSkills.join(", ")}</p>
            {user.role === "student" && (
              <button style={btnStyle} onClick={() => handleApply(i._id)}>Apply</button>
            )}
          </div>
        ))}
        {internships.length === 0 && <p>No open internships yet.</p>}
      </div>
    </div>
  );
};

const inputStyle = { display: "block", width: "100%", padding: 10, marginBottom: 10, border: "1px solid #cbd5e1", borderRadius: 6 };
const btnStyle = { padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };

export default Internships;
