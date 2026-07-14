const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User schema supports three roles for Role-Based Access Control (RBAC):
 *  - student:          browses internships, receives ML-powered recommendations, applies
 *  - recruiter:        posts internships, reviews & updates application status
 *  - placement_admin:  full visibility, real-time analytics dashboard, manages platform
 */
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["student", "recruiter", "placement_admin"],
      default: "student",
    },
    department: { type: String, default: "" },
    // Free-text + structured skills used as input features for the
    // Scikit-learn content-based recommendation engine.
    skills: [{ type: String, trim: true }],
    bio: { type: String, default: "" },
    company: { type: String, default: "" }, // recruiters only
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);
