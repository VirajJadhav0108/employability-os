const mongoose = require("mongoose");

/**
 * Internship postings created by recruiters.
 * `requiredSkills` is the feature vector the ML micro-service compares
 * against a student's `skills` array to compute a match score.
 */
const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true, required: true }],
    location: { type: String, default: "Remote" },
    stipend: { type: Number, default: 0 },
    durationWeeks: { type: Number, default: 8 },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", InternshipSchema);
