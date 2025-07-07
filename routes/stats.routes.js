// Stats routes placeholder
const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Get statistics (admin only)
router.get(
  "/stats",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(statsController.getStats)
);
// Get user's dashboard stats (authenticated users)
router.get(
  "/dashboard-stats",
  authenticateToken,
  asyncHandler(statsController.getDashboardStats)
);

module.exports = router;
