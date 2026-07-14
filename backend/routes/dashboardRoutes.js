const express = require("express");
const { getAdminStats, getStudentStats } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/admin", protect, authorize("placement_admin"), getAdminStats);
router.get("/student", protect, authorize("student"), getStudentStats);

module.exports = router;
