const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const { authenticateToken } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    summary: Register a new user
 *    description: Register a new user with email and password.
 *    tags:
 *      - Authentication
 *    responses:
 *      '201':
 *        description: User registered successfully
 */
router.post("/register", asyncHandler(authController.register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

router.post("/login", asyncHandler(authController.login));

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Auth Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/profile", authenticateToken, authController.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Auth Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - firstName
 *              - lastName
 *              - phone
 *              - email
 *             properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              phone:
 *               type: string
 *              email:
 *               type: string

 *
 *     content:
 *     responses:
 *       200:
 *         description: Success
 */

router.put(
  "/profile",
  authenticateToken,
  asyncHandler(authController.updateProfile)
);
/**
 * @swagger
 * /api/auth/change-password:
 *  put:
 *    summary: Change user password
 *    description: Change the password of the authenticated user.
 *    tags:
 *      - Authentication
 *    responses:
 *      '200':
 *        description: Password changed successfully
 */
router.put(
  "/change-password",
  authenticateToken,
  asyncHandler(authController.changePassword)
);
/**
 * @swagger
 * /api/auth/refresh:
 *  post:
 *    summary: Refresh authentication token
 *    description: Refresh the authentication token for the user.
 *    tags:
 *      - Authentication
 *    responses:
 *      '200':
 *        description: Token refreshed successfully
 */
router.post("/refresh", authenticateToken, authController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *  post:
 *    summary: User logout
 *    description: Logout the authenticated user.
 *    tags:
 *      - Authentication
 *    responses:
 *      '200':
 *        description: User logged out successfully
 */
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
