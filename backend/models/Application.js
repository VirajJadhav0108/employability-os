const mongoose = require("mongoose");

/**
 * Tracks a student's application to an internship and its lifecycle.
 * Status changes here are what drive the real-time dashboard events
 * (emitted over Socket.io in utils/socket.js).
 */
const ApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "selected", "rejected"],
      default: "applied",
    },
    matchScore: { type: Number, default: null }, // filled in from ML recommendation, if applicable
  },
  { timestamps: true }
);

ApplicationSchema.index({ student: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
