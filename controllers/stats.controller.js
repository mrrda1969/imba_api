// Stats controller
const { User, Agency, Listing, Image } = require("../models/api.models");

// Get statistics (admin only)
const getStats = async (req, res) => {
  const [userCount, agencyCount, listingCount, imageCount] = await Promise.all([
    User.countDocuments(),
    Agency.countDocuments(),
    Listing.countDocuments(),
    Image.countDocuments(),
  ]);

  const avgPrice = await Listing.aggregate([
    { $group: { _id: null, avgPrice: { $avg: "$price" } } },
  ]);

  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  res.json({
    users: userCount,
    agencies: agencyCount,
    listings: listingCount,
    images: imageCount,
    averagePrice: avgPrice[0]?.avgPrice || 0,
    usersByRole: usersByRole.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
  });
};

// Get user's dashboard stats (authenticated users)
const getDashboardStats = async (req, res) => {
  const stats = {};

  if (req.user.role === "agent") {
    // Agent-specific stats
    const myListings = await Listing.countDocuments({
      listing_agent: req.user._id,
    });
    const myListingsWithImages = await Listing.aggregate([
      { $match: { listing_agent: req.user._id } },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "listing_id",
          as: "images",
        },
      },
      { $match: { "images.0": { $exists: true } } },
      { $count: "count" },
    ]);

    stats.myListings = myListings;
    stats.myListingsWithImages = myListingsWithImages[0]?.count || 0;
  }

  // General stats for all users
  stats.totalListings = await Listing.countDocuments();
  stats.totalAgencies = await Agency.countDocuments();

  res.json(stats);
};

module.exports = {
  getStats,
  getDashboardStats,
};
