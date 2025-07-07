// Listing routes placeholder
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const {
  authenticateToken,
  authorizeRoles,
  authorizeOwnerOrAdmin,
} = require("../middleware/auth.middleware");

// Get all listings (public)
router.get("/", asyncHandler(listingController.getAllListings));
// Get listing by ID (public)
router.get("/:id", asyncHandler(listingController.getListingById));
// Create new listing (agents and admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  asyncHandler(listingController.createListing)
);
// Update listing (owner or admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  authorizeOwnerOrAdmin(),
  asyncHandler(listingController.updateListing)
);
// Delete listing (owner or admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  authorizeOwnerOrAdmin(),
  asyncHandler(listingController.deleteListing)
);
// Get listings by agent (authenticated users)
router.get(
  "/agent/:agentId",
  authenticateToken,
  asyncHandler(listingController.getListingsByAgent)
);
// Get listings by agency (authenticated users)
router.get(
  "/agency/:agencyId",
  authenticateToken,
  asyncHandler(listingController.getListingsByAgency)
);
// Get current user's listings (authenticated agents)
router.get(
  "/my-listings",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  asyncHandler(listingController.getMyListings)
);

module.exports = router;
