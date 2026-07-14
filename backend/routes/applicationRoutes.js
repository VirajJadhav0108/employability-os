const express = require("express");
const {
  applyToInternship,
  getMyApplications,
  listApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("student"), applyToInternship);
router.get("/mine", protect, authorize("student"), getMyApplications);
router.get("/", protect, authorize("recruiter", "placement_admin"), listApplications);
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter", "placement_admin"),
  updateApplicationStatus
);

module.exports = router;
