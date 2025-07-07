// Image controller
const { Image, Listing } = require("../models/api.models");

// Get all images for a listing (public)
const getImagesForListing = async (req, res) => {
  const images = await Image.find({ listing_id: req.params.listingId });
  res.json(images);
};

// Add image to listing (owner or admin only)
const addImageToListing = async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (
    req.user.role !== "admin" &&
    listing.listing_agent.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      message: "Access denied. You can only add images to your own listings.",
    });
  }

  const image = new Image({
    ...req.body,
    listing_id: req.params.listingId,
  });
  await image.save();
  res.status(201).json(image);
};

// Update image (owner or admin only)
const updateImage = async (req, res) => {
  const image = await Image.findById(req.params.id).populate("listing_id");
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  if (
    req.user.role !== "admin" &&
    image.listing_id.listing_agent.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      message:
        "Access denied. You can only modify images for your own listings.",
    });
  }

  const updatedImage = await Image.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updatedImage);
};

// Delete image (owner or admin only)
const deleteImage = async (req, res) => {
  const image = await Image.findById(req.params.id).populate("listing_id");
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  if (
    req.user.role !== "admin" &&
    image.listing_id.listing_agent.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      message:
        "Access denied. You can only delete images for your own listings.",
    });
  }

  await Image.findByIdAndDelete(req.params.id);
  res.json({ message: "Image deleted successfully" });
};

// Unprotected: Add image to listing
const addImageToListingPublic = async (req, res) => {
  const image = new Image({
    ...req.body,
    listing_id: req.params.listingId,
  });
  await image.save();
  res.status(201).json(image);
};

// Unprotected: Update image
const updateImagePublic = async (req, res) => {
  const image = await Image.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }
  res.json(image);
};

// Unprotected: Delete image
const deleteImagePublic = async (req, res) => {
  const image = await Image.findByIdAndDelete(req.params.id);
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }
  res.json({ message: "Image deleted successfully" });
};

module.exports = {
  getImagesForListing,
  addImageToListing,
  updateImage,
  deleteImage,
  addImageToListingPublic,
  updateImagePublic,
  deleteImagePublic,
};
