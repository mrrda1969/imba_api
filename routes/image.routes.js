const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Get all images for a listing (public)
router.get(
  "/listings/:listingId/images",
  asyncHandler(imageController.getImagesForListing)
);
// Add image to listing (owner or admin only)
router.post(
  "/listings/:listingId/images",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  asyncHandler(imageController.addImageToListing)
);
// Update image (owner or admin only)
router.put(
  "/images/:id",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  asyncHandler(imageController.updateImage)
);
// Delete image (owner or admin only)
router.delete(
  "/images/:id",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  asyncHandler(imageController.deleteImage)
);

// Unprotected: Add image to listing
router.post(
  "/public/listings/:listingId/images",
  asyncHandler(imageController.addImageToListingPublic)
);
// Unprotected: Update image
router.put(
  "/public/images/:id",
  asyncHandler(imageController.updateImagePublic)
);
// Unprotected: Delete image
router.delete(
  "/public/images/:id",
  asyncHandler(imageController.deleteImagePublic)
);

module.exports = router;
