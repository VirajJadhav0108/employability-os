import { useEffect, useState } from "react";
import api from "../api/axios";

/**
 * Displays personalized internship matches computed by the
 * Scikit-learn recommendation micro-service (see /ml-service).
 * The Node backend fetches the ranked results and this page just renders them.
 */
const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/recommendations")
      .then((res) => setRecommendations(res.data.recommendations))
      .catch((err) => setError(err.response?.data?.message || "Could not load recommendations"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Finding your best-matched internships...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h2>Recommended for You</h2>
      <p style={{ color: "#64748b" }}>
        Ranked by our Scikit-learn content-based matching engine, comparing your skills
        against each internship's requirements.
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "grid", gap: 16 }}>
        {recommendations.map(({ internship, matchScore }) => (
          <div key={internship._id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{internship.title} — {internship.company}</h3>
              <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: 999, fontSize: 14 }}>
                {Math.round(matchScore * 100)}% match
              </span>
            </div>
            <p>{internship.description}</p>
            <p><b>Skills:</b> {internship.requiredSkills.join(", ")}</p>
          </div>
        ))}
        {recommendations.length === 0 && !error && <p>No recommendations yet — add some skills to your profile!</p>}
      </div>
    </div>
  );
};

export default Recommendations;
