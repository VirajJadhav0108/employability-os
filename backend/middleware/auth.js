const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect: verifies the JWT sent in the Authorization header
 * (format: "Bearer <token>") and attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

/**
 * authorize: Role-Based Access Control (RBAC) guard.
 * Usage: authorize("recruiter", "placement_admin")
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Requires role: ${allowedRoles.join(" or ")}`,
    });
  }
  next();
};

module.exports = { protect, authorize };
