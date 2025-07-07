// Agency routes placeholder
const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agency.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Get all agencies (authenticated users)
router.get(
  "/",
  authenticateToken,
  asyncHandler(agencyController.getAllAgencies)
);
// Get agency by ID (authenticated users)
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(agencyController.getAgencyById)
);
// Create new agency (admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(agencyController.createAgency)
);
// Update agency (admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(agencyController.updateAgency)
);
// Delete agency (admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(agencyController.deleteAgency)
);
// Get child agencies (authenticated users)
router.get(
  "/:id/children",
  authenticateToken,
  asyncHandler(agencyController.getChildAgencies)
);

module.exports = router;
