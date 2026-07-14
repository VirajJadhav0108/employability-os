import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { socket } from "../utils/socket";

const COLORS = ["#2563eb", "#f59e0b", "#16a34a", "#dc2626"];

/**
 * Real-time dashboard: for placement_admin, shows platform-wide analytics
 * (aggregated via MongoDB pipelines on the backend). Charts refetch
 * whenever a Socket.IO event announces a new/updated application or
 * internship posting, so the numbers update live without a page reload.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  const fetchStats = () => {
    const endpoint = user.role === "placement_admin" ? "/dashboard/admin" : "/dashboard/student";
    api.get(endpoint).then((res) => setStats(res.data));
  };

  useEffect(() => {
    fetchStats();
    const events = ["application:new", "application:updated", "internship:new"];
    events.forEach((ev) => socket.on(ev, fetchStats));
    return () => events.forEach((ev) => socket.off(ev, fetchStats));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return <p style={{ padding: 24 }}>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <h2>{user.role === "placement_admin" ? "Placement Analytics" : "My Application Funnel"}</h2>

      {user.role === "placement_admin" && (
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <StatCard label="Students" value={stats.totalStudents} />
          <StatCard label="Open Internships" value={stats.totalInternships} />
          <StatCard label="Applications" value={stats.totalApplications} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h3>Applications by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats.statusBreakdown}
                dataKey="count"
                nameKey="_id"
                outerRadius={90}
                label
              >
                {stats.statusBreakdown.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {stats.topSkillsInDemand && (
          <div>
            <h3>Top Skills in Demand</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.topSkillsInDemand}>
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, textAlign: "center" }}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    <div style={{ color: "#64748b" }}>{label}</div>
  </div>
);

export default Dashboard;
