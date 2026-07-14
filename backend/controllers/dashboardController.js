const Application = require("../models/Application");
const Internship = require("../models/Internship");
const User = require("../models/User");

/**
 * @route GET /api/dashboard/stats  (placement_admin only)
 * Aggregates platform-wide numbers that power the real-time dashboard
 * (recharts on the frontend). Re-computed on demand; also pushed live
 * whenever an application/internship event fires (see utils/socket.js).
 */
const getAdminStats = async (req, res) => {
  try {
    const [statusBreakdown, totalStudents, totalInternships, totalApplications, topSkills] =
      await Promise.all([
        Application.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        User.countDocuments({ role: "student" }),
        Internship.countDocuments({ status: "open" }),
        Application.countDocuments(),
        Internship.aggregate([
          { $unwind: "$requiredSkills" },
          { $group: { _id: "$requiredSkills", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ]),
      ]);

    res.json({
      totalStudents,
      totalInternships,
      totalApplications,
      statusBreakdown, // e.g. [{ _id: "shortlisted", count: 12 }, ...]
      topSkillsInDemand: topSkills,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to compute dashboard stats", error: err.message });
  }
};

// @route GET /api/dashboard/student  (student only) — personal funnel view
const getStudentStats = async (req, res) => {
  try {
    const breakdown = await Application.aggregate([
      { $match: { student: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json({ statusBreakdown: breakdown });
  } catch (err) {
    res.status(500).json({ message: "Failed to compute student stats", error: err.message });
  }
};

module.exports = { getAdminStats, getStudentStats };
