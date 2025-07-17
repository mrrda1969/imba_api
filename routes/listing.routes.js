const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.controller");
const asyncHandler = require("../utils/asyncHandler.util");
const {
  authenticateToken,
  authorizeRoles,
  authorizeOwnerOrAdmin,
} = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/listings:
 *  get:
 *   tags: [Listings]
 *   summary: Get all listings
 *   description: Retrieve a list of all property listings.
 */
router.get("/", asyncHandler(listingController.getAllListings));

/**
 * @swagger
 * /api/listings/{id}:
 *  get:
 *   tags: [Listings]
 *   summary: Get listing by ID
 *   description: Retrieve a property listing by its unique ID.
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *       properties:
 *        id:
 *         type: String
 */
router.get("/:id", asyncHandler(listingController.getListingById));

/**
 * @swagger
 * /api/listings:
 *  post:
 *   tags: [Listings]
 *   summary: Create a new listing
 *   description: Create a new property listing. Only accessible by agents or admins.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *      properties:
 *       title:
 *        type: string
 *       city:
 *        type: string
 *       suburb:
 *        type: string
 *       price:
 *        type: number
 *       description:
 *        type: string
 *       images:
 *        type: string
 *       listing_agent:
 *        type: string
 *       listing_agency:
 *        type: string
 *       required:
 *        - title
 *        - city
 *        - suburb
 *        - price
 *        - listing_agent
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  asyncHandler(listingController.createListing)
);

/**
 * @swagger
 * /api/listings/{id}:
 *  put:
 *   tags: [Listings]
 *   summary: Update a listing by ID
 *   description: Update a property listing by its unique ID. Only accessible by the owner or admin.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *      properties:
 *       title:
 *        type: string
 *       city:
 *        type: string
 *       suburb:
 *        type: string
 *       price:
 *        type: number
 *       description:
 *        type: string
 *       images:
 *        type: string
 *       listing_agent:
 *        type: string
 *       listing_agency:
 *        type: string
 *
 */
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
/**
 * @swagger
 * /api/listings/agent/{agentId}:
 *  get:
 *   tags: [Listings]
 *   summary: Get listings by agent
 *   description: Retrieve all listings for a specific agent. Authentication required.
 *   parameters:
 *    - in: path
 *      name: agentId
 *      required: true
 *      schema:
 *        type: string
 *      description: The agent's user ID
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: List of listings for the agent
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Agent not found
 */
router.get(
  "/agent/:agentId",
  authenticateToken,
  asyncHandler(listingController.getListingsByAgent)
);
// Get listings by agency (authenticated users)
/**
 * @swagger
 * /api/listings/agency/{agencyId}:
 *  get:
 *   tags: [Listings]
 *   summary: Get listings by agency
 *   description: Retrieve all listings for a specific agency. Authentication required.
 *   parameters:
 *    - in: path
 *      name: agencyId
 *      required: true
 *      schema:
 *        type: string
 *      description: The agency's ID
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: List of listings for the agency
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Agency not found
 */
router.get(
  "/agency/:agencyId",
  authenticateToken,
  asyncHandler(listingController.getListingsByAgency)
);
// Get current user's listings (authenticated agents)
/**
 * @swagger
 * /api/listings/my-listings:
 *  get:
 *   tags: [Listings]
 *   summary: Get current user's listings
 *   description: Retrieve all listings for the authenticated agent or admin.
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: List of listings for the current user
 *    401:
 *     description: Unauthorized
 */
router.get(
  "/my-listings",
  authenticateToken,
  authorizeRoles("agent", "admin"),
  asyncHandler(listingController.getMyListings)
);

module.exports = router;
