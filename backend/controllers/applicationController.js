const Application = require("../models/Application");
const Internship = require("../models/Internship");
const { emitEvent } = require("../utils/socket");

// @route POST /api/applications  (student only)
const applyToInternship = async (req, res) => {
  try {
    const { internshipId, matchScore } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ message: "Internship not found" });

    const application = await Application.create({
      student: req.user._id,
      internship: internshipId,
      matchScore: matchScore ?? null,
    });

    emitEvent("application:new", application, "placement_admin");
    emitEvent("application:new", application, "recruiter");

    return res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this internship" });
    }
    return res.status(500).json({ message: "Failed to submit application", error: err.message });
  }
};

// @route GET /api/applications/mine  (student only)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("internship");
    return res.json(applications);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// @route GET /api/applications  (recruiter / placement_admin)
const listApplications = async (req, res) => {
  try {
    const { status, internshipId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (internshipId) filter.internship = internshipId;

    const applications = await Application.find(filter)
      .populate("student", "name email skills department")
      .populate("internship", "title company");

    return res.json(applications);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// @route PATCH /api/applications/:id/status  (recruiter / placement_admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["applied", "shortlisted", "selected", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("student", "name email").populate("internship", "title company");

    if (!application) return res.status(404).json({ message: "Application not found" });

    // Drives the real-time dashboard: status chart updates live for
    // placement_admin and the affected student without a page refresh.
    emitEvent("application:updated", application, "placement_admin");
    emitEvent("application:updated", application, `student:${application.student._id}`);

    return res.json(application);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update application", error: err.message });
  }
};

module.exports = { applyToInternship, getMyApplications, listApplications, updateApplicationStatus };
