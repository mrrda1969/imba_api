const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const { authenticateToken } = require("../middleware/auth.middleware");

// Register
router.post("/register", asyncHandler(authController.register));
// Login
router.post("/login", asyncHandler(authController.login));
// Get profile
router.get("/profile", authenticateToken, authController.getProfile);
// Update profile
router.put(
  "/profile",
  authenticateToken,
  asyncHandler(authController.updateProfile)
);
// Change password
router.put(
  "/change-password",
  authenticateToken,
  asyncHandler(authController.changePassword)
);
// Refresh token
router.post("/refresh", authenticateToken, authController.refreshToken);
// Logout
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
