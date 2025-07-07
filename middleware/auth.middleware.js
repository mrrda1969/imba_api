import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "a_good_man_is_hard_to_find";

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

// Check if user owns resource or is admin
export const authorizeOwnerOrAdmin = (resourceField = "listing_agent") => {
  return async (req, res, next) => {
    try {
      if (req.user.role === "admin") {
        return next();
      }

      // For listings, check if user is the listing agent
      if (req.route.path.includes("listings")) {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
          return res.status(404).json({ message: "Listing not found" });
        }

        if (listing[resourceField].toString() !== req.user._id.toString()) {
          return res.status(403).json({
            message: "Access denied. You can only modify your own listings.",
          });
        }
      }

      // For users, check if user is modifying their own profile
      if (req.route.path.includes("users")) {
        if (req.params.id !== req.user._id.toString()) {
          return res.status(403).json({
            message: "Access denied. You can only modify your own profile.",
          });
        }
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Authorization error" });
    }
  };
};
