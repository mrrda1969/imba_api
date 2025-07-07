const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const agencyRoutes = require("./routes/agency.routes");
const listingRoutes = require("./routes/listing.routes");
const imageRoutes = require("./routes/image.routes");
const statsRoutes = require("./routes/stats.routes");

// Import error middleware
const { notFound, errorHandler } = require("./middleware/error.middleware");

// use logger
app.use(logger("dev"));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api", imageRoutes); // image routes use /listings/:listingId/images and /images/:id
app.use("/api", statsRoutes); // stats and dashboard-stats

// Error handling
app.use(notFound);
app.use(errorHandler);

// =======================
// SERVER SETUP
// =======================

const PORT = process.env.PORT || 5300;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("\n=== API Endpoints ===");
      console.log("Authentication:");
      console.log("POST /api/auth/register - Register new user");
      console.log("POST /api/auth/login - Login user");
      console.log("GET /api/auth/profile - Get current user profile");
      console.log("PUT /api/auth/profile - Update profile");
      console.log("PUT /api/auth/change-password - Change password");
      console.log("POST /api/auth/refresh - Refresh token");
      console.log("POST /api/auth/logout - Logout");
      console.log("\nProtected Routes (require authentication):");
      console.log("Users (admin only), Agencies, Listings, Images");
      console.log("See code for complete endpoint documentation");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

module.exports = app;
