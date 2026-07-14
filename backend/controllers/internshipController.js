const Internship = require("../models/Internship");
const { emitEvent } = require("../utils/socket");

// @route POST /api/internships  (recruiter only)
const createInternship = async (req, res) => {
  try {
    const { title, company, description, requiredSkills, location, stipend, durationWeeks } = req.body;

    const internship = await Internship.create({
      title,
      company,
      description,
      requiredSkills,
      location,
      stipend,
      durationWeeks,
      postedBy: req.user._id,
    });

    // Real-time push so every connected dashboard updates instantly
    // instead of polling the DB.
    emitEvent("internship:new", internship, "placement_admin");
    emitEvent("internship:new", internship, "student");

    return res.status(201).json(internship);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create internship", error: err.message });
  }
};

// @route GET /api/internships  (all authenticated roles)
const listInternships = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const internships = await Internship.find(filter)
      .populate("postedBy", "name company")
      .sort({ createdAt: -1 });
    return res.json(internships);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch internships", error: err.message });
  }
};

// @route GET /api/internships/:id
const getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate("postedBy", "name company");
    if (!internship) return res.status(404).json({ message: "Internship not found" });
    return res.json(internship);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch internship", error: err.message });
  }
};

// @route PATCH /api/internships/:id  (recruiter who owns it, or placement_admin)
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: "Internship not found" });

    const isOwner = internship.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "placement_admin") {
      return res.status(403).json({ message: "Not authorized to modify this internship" });
    }

    Object.assign(internship, req.body);
    await internship.save();

    emitEvent("internship:updated", internship, "placement_admin");
    return res.json(internship);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update internship", error: err.message });
  }
};

module.exports = { createInternship, listInternships, getInternship, updateInternship };
