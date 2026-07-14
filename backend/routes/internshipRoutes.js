const express = require("express");
const {
  createInternship,
  listInternships,
  getInternship,
  updateInternship,
} = require("../controllers/internshipController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, listInternships);
router.get("/:id", protect, getInternship);
router.post("/", protect, authorize("recruiter"), createInternship);
router.patch("/:id", protect, authorize("recruiter", "placement_admin"), updateInternship);

module.exports = router;
