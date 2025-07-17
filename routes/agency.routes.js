const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agency.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Get all agencies (authenticated users)
/**
 * @swagger
 * /api/agencies:
 *  get:
 *   tags: [Agencies]
 *   summary: Get all agencies
 *   description: Retrieve a list of all agencies. Authentication required.
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: List of agencies
 *    401:
 *     description: Unauthorized
 */
router.get(
  "/",
  authenticateToken,
  asyncHandler(agencyController.getAllAgencies)
);
// Get agency by ID (authenticated users)
/**
 * @swagger
 * /api/agencies/{id}:
 *  get:
 *   tags: [Agencies]
 *   summary: Get agency by ID
 *   description: Retrieve an agency by its unique ID. Authentication required.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The agency's ID
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Agency details
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Agency not found
 */
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(agencyController.getAgencyById)
);
// Create new agency (admin only)
/**
 * @swagger
 * /api/agencies:
 *  post:
 *   tags: [Agencies]
 *   summary: Create a new agency
 *   description: Create a new agency. Only accessible by admins.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *      properties:
 *       name:
 *        type: string
 *       email:
 *        type: string
 *       phone:
 *        type: string
 *       whatsapp_number:
 *        type: string
 *       address:
 *        type: string
 *       primary_suburb:
 *        type: string
 *       allowed_suburbs:
 *        type: array
 *        items:
 *         type: string
 *       parent_agency_id:
 *        type: string
 *       logo:
 *        type: string
 *      required:
 *        - name
 *        - email
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    201:
 *     description: Agency created
 *    401:
 *     description: Unauthorized
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(agencyController.createAgency)
);
// Update agency (admin only)
/**
 * @swagger
 * /api/agencies/{id}:
 *  put:
 *   tags: [Agencies]
 *   summary: Update agency by ID
 *   description: Update an agency by its unique ID. Only accessible by admins.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The agency's ID
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *      properties:
 *       name:
 *        type: string
 *       email:
 *        type: string
 *       phone:
 *        type: string
 *       whatsapp_number:
 *        type: string
 *       address:
 *        type: string
 *       primary_suburb:
 *        type: string
 *       allowed_suburbs:
 *        type: array
 *        items:
 *         type: string
 *       parent_agency_id:
 *        type: string
 *       logo:
 *        type: string
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Agency updated
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Agency not found
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(agencyController.updateAgency)
);
// Delete agency (admin only)
/**
 * @swagger
 * /api/agencies/{id}:
 *  delete:
 *   tags: [Agencies]
 *   summary: Delete agency by ID
 *   description: Delete an agency by its unique ID. Only accessible by admins.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The agency's ID
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Agency deleted
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Agency not found
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(agencyController.deleteAgency)
);
// Get child agencies (authenticated users)
/**
 * @swagger
 * /api/agencies/{id}/children:
 *  get:
 *   tags: [Agencies]
 *   summary: Get child agencies
 *   description: Retrieve all child agencies for a specific parent agency. Authentication required.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The parent agency's ID
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: List of child agencies
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Parent agency not found
 */
router.get(
  "/:id/children",
  authenticateToken,
  asyncHandler(agencyController.getChildAgencies)
);

module.exports = router;
