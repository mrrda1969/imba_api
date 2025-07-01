import express from "express";
import Listing from "../models/Listing.js";
import { asyncHandler } from "../lib/utils/async.handler.js";
import Image from "../models/Image.js";

const listingRouter = express.Router();

// Get all listings with filters
listingRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      city,
      suburb,
      minPrice,
      maxPrice,
      agent,
      agency,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};
    if (city) filter.city = new RegExp(city, "i");
    if (suburb) filter.suburb = new RegExp(suburb, "i");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (agent) filter.listing_agent = agent;
    if (agency) filter.listing_agency = agency;

    const listings = await Listing.find(filter)
      .populate("listing_agent", "firstname lastname email phone")
      .populate("listing_agency", "name email phone")
      .populate("listingImages")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  })
);

// Get listing by ID
listingRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate("listing_agent", "firstname lastname email phone")
      .populate("listing_agency", "name email phone address")
      .populate("listingImages");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  })
);

// Create new listing
listingRouter.post(
  "/new",
  asyncHandler(async (req, res) => {
    const listing = new Listing(req.body);
    await listing.save();
    await listing.populate([
      { path: "listing_agent", select: "firstname lastname email phone" },
      { path: "listing_agency", select: "name email phone" },
      { path: "listingImages" },
    ]);
    res.status(201).json(listing);
  })
);

// Update listing
listingRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "listing_agent", select: "firstname lastname email phone" },
      { path: "listing_agency", select: "name email phone" },
      { path: "listingImages" },
    ]);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  })
);

// Delete listing
listingRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Delete associated images
    await Image.deleteMany({ listing_id: req.params.id });

    res.json({ message: "Listing and associated images deleted successfully" });
  })
);

// Get listings by agent
listingRouter.get(
  "/agent/:agentId/",
  asyncHandler(async (req, res) => {
    const listings = await Listing.find({ listing_agent: req.params.agentId })
      .populate("listing_agency", "name")
      .populate("listingImages");
    res.json(listings);
  })
);

// Get listings by agency
listingRouter.get(
  "/agency/:agencyId/",
  asyncHandler(async (req, res) => {
    const listings = await Listing.find({ listing_agency: req.params.agencyId })
      .populate("listing_agent", "firstname lastname")
      .populate("listingImages");
    res.json(listings);
  })
);

// get all images for a listing
listingRouter.get(
  "/:listingId/images",
  asyncHandler(async (req, res) => {
    const images = await Image.find({ listing_id: req.params.listingId });
    res.json(images);
  })
);

// Add image to listing
listingRouter.post(
  "/:listingId/images",
  asyncHandler(async (req, res) => {
    const image = new Image({
      ...req.body,
      listing_id: req.params.listingId,
    });
    await image.save();
    res.status(201).json(image);
  })
);

// search
listingRouter.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(q, "i");
    const filter = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { suburb: searchRegex },
      ],
    };

    const listings = await Listing.find(filter)
      .populate("listing_agent", "firstname lastname")
      .populate("listing_agency", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      query: q,
    });
  })
);

// Get statistics
listingRouter.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const [userCount, agencyCount, listingCount, imageCount] =
      await Promise.all([
        User.countDocuments(),
        Agency.countDocuments(),
        Listing.countDocuments(),
        Image.countDocuments(),
      ]);

    const avgPrice = await Listing.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$price" } } },
    ]);

    res.json({
      users: userCount,
      agencies: agencyCount,
      listings: listingCount,
      images: imageCount,
      averagePrice: avgPrice[0]?.avgPrice || 0,
    });
  })
);

export default listingRouter;
