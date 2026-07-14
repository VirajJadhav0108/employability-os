const axios = require("axios");
const Internship = require("../models/Internship");

/**
 * @route GET /api/recommendations  (student only)
 *
 * This is the integration point named in the resume bullet:
 * "Integrated Scikit-learn recommendation engine via backend APIs to
 * power personalized internship-student matching."
 *
 * The Node backend does NOT implement the ML itself. It gathers the
 * student's profile + all open internships from MongoDB, then calls
 * out to the Python (Flask + scikit-learn) recommendation micro-service
 * over HTTP, and returns the ranked results to the frontend.
 */
const getRecommendations = async (req, res) => {
  try {
    const student = req.user;
    const openInternships = await Internship.find({ status: "open" });

    if (openInternships.length === 0) {
      return res.json({ recommendations: [] });
    }

    const payload = {
      student_skills: student.skills,
      internships: openInternships.map((i) => ({
        id: i._id.toString(),
        title: i.title,
        company: i.company,
        description: i.description,
        required_skills: i.requiredSkills,
      })),
      top_n: req.query.top_n ? parseInt(req.query.top_n, 10) : 5,
    };

    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    const { data } = await axios.post(`${mlServiceUrl}/recommend`, payload, { timeout: 5000 });

    // Re-attach full internship documents to the ranked id/score pairs
    // returned by the ML service, so the frontend gets everything in one call.
    const internshipMap = new Map(openInternships.map((i) => [i._id.toString(), i]));
    const recommendations = data.recommendations.map((r) => ({
      internship: internshipMap.get(r.internship_id),
      matchScore: r.score,
    }));

    return res.json({ recommendations });
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({
        message: "Recommendation engine is unavailable. Is the ml-service running?",
      });
    }
    return res.status(500).json({ message: "Failed to fetch recommendations", error: err.message });
  }
};

module.exports = { getRecommendations };
