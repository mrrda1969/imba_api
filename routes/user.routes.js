// User routes placeholder
const express = require("express");
const { authenticateToken } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler.util");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/", authenticateToken, asyncHandler(userController.getAllUsers));
router.get("/:id", authenticateToken, asyncHandler(userController.getUserById));
router.post("/", authenticateToken, asyncHandler(userController.createUser));
router.put("/:id", authenticateToken, asyncHandler(userController.updateUser));
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(userController.deleteUser)
);

module.exports = router;
