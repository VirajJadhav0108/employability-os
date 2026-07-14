import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>e-OS</Link>
      <div style={styles.links}>
        {user?.role === "student" && (
          <>
            <Link to="/internships" style={styles.link}>Internships</Link>
            <Link to="/recommendations" style={styles.link}>Recommended for You</Link>
            <Link to="/dashboard" style={styles.link}>My Dashboard</Link>
          </>
        )}
        {user?.role === "recruiter" && (
          <>
            <Link to="/internships" style={styles.link}>Manage Postings</Link>
          </>
        )}
        {user?.role === "placement_admin" && (
          <Link to="/dashboard" style={styles.link}>Analytics Dashboard</Link>
        )}
        {user ? (
          <button onClick={handleLogout} style={styles.button}>Logout ({user.name})</button>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#0f172a",
    color: "#fff",
  },
  brand: { color: "#fff", fontWeight: 700, fontSize: 20, textDecoration: "none" },
  links: { display: "flex", gap: 16, alignItems: "center" },
  link: { color: "#e2e8f0", textDecoration: "none" },
  button: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" },
};

export default Navbar;
