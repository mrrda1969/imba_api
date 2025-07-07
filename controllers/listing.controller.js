// Listing controller
const { Listing, Image } = require("../models/api.models");

// Get all listings with filters (public)
const getAllListings = async (req, res) => {
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
};

// Get listing by ID (public)
const getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("listing_agent", "firstname lastname email phone")
    .populate("listing_agency", "name email phone address")
    .populate("listingImages");

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json(listing);
};

// Create new listing (agents and admin only)
const createListing = async (req, res) => {
  const listing = new Listing({
    ...req.body,
    listing_agent: req.user._id, // Automatically set to current user
  });
  await listing.save();
  await listing.populate([
    { path: "listing_agent", select: "firstname lastname email phone" },
    { path: "listing_agency", select: "name email phone" },
    { path: "listingImages" },
  ]);
  res.status(201).json(listing);
};

// Update listing (owner or admin only)
const updateListing = async (req, res) => {
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
};

// Delete listing (owner or admin only)
const deleteListing = async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  // Delete associated images
  await Image.deleteMany({ listing_id: req.params.id });

  res.json({ message: "Listing and associated images deleted successfully" });
};

// Get listings by agent (authenticated users)
const getListingsByAgent = async (req, res) => {
  const listings = await Listing.find({ listing_agent: req.params.agentId })
    .populate("listing_agency", "name")
    .populate("listingImages");
  res.json(listings);
};

// Get listings by agency (authenticated users)
const getListingsByAgency = async (req, res) => {
  const listings = await Listing.find({ listing_agency: req.params.agencyId })
    .populate("listing_agent", "firstname lastname")
    .populate("listingImages");
  res.json(listings);
};

// Get current user's listings (authenticated agents)
const getMyListings = async (req, res) => {
  const listings = await Listing.find({ listing_agent: req.user._id })
    .populate("listing_agency", "name")
    .populate("listingImages")
    .sort({ createdAt: -1 });
  res.json(listings);
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByAgent,
  getListingsByAgency,
  getMyListings,
};
