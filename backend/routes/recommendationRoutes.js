const express = require("express");
const { getRecommendations } = require("../controllers/recommendationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, authorize("student"), getRecommendations);

module.exports = router;
