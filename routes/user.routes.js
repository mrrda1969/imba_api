// User routes placeholder
const express = require("express");
const { authenticateToken } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler.util");
const userController = require("../controllers/user.controller");
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *  get:
 *   tags: [Users]
 *   summary: Get all users
 *   description: Retrieve a list of all users in the system.
 */
router.get("/", authenticateToken, asyncHandler(userController.getAllUsers));

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *   tags: [Users]
 *   summary: get User by ID
 *   description: Retrieve a user by their unique ID.
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *        properties:
 *         id:
 *         type: string
 */
router.get("/:id", authenticateToken, asyncHandler(userController.getUserById));
router.post("/", authenticateToken, asyncHandler(userController.createUser));
router.put("/:id", authenticateToken, asyncHandler(userController.updateUser));
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(userController.deleteUser)
);

module.exports = router;
