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
/**
 * @swagger
 * /api/users:
 *  post:
 *   tags: [Users]
 *   summary: Create a new user
 *   description: Create a new user in the system. Only accessible by admin.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *      properties:
 *       firstname:
 *        type: string
 *       lastname:
 *        type: string
 *       email:
 *        type: string
 *       password:
 *        type: string
 *       phone:
 *        type: string
 *       role:
 *        type: string
 *        enum: [user, agent, admin]
 *
 */
router.post("/", authenticateToken, asyncHandler(userController.createUser));

/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *   tags: [Users]
 *   summary: Update a user by ID
 *   description: Update user details by their unique ID. Only accessible by admin.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *      properties:
 *       firstname:
 *        type: string
 *       lastname:
 *        type: string
 *       email:
 *        type: string
 *       phone:
 *        type: string
 */
router.put("/:id", authenticateToken, asyncHandler(userController.updateUser));

/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *   tags: [Users]
 *   summary: Delete a user by ID
 *   description: Delete a user from the system by their unique ID. Only accessible by admin.
 */
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(userController.deleteUser)
);

module.exports = router;
