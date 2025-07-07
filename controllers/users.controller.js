import express from "express";
import User from "../models/User.js";
import { asyncHandler } from "../lib/utils/async.handler.js";
import {
  authorizeOwnerOrAdmin,
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const userRouter = express.Router();

// Get all users (admin only)
userRouter.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const { role, page = 1, limit = 10 } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  })
);

// Create new user (admin only)
userRouter.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  })
);

// Get user by ID (admin or self)
userRouter.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Allow users to view their own profile or admin to view any
    if (
      req.user.role !== "admin" &&
      req.params.id !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  })
);

// Create new user
userRouter.post(
  "/add",
  asyncHandler(async (req, res) => {
    const user = new User(req.body);
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  })
);

// Update user (admin or self)
userRouter.put(
  "/:id",
  authenticateToken,
  authorizeOwnerOrAdmin(),
  asyncHandler(async (req, res) => {
    // Don't allow password changes through this endpoint
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  })
);

// Delete user (admin only)
userRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  })
);

// Get current user profile
userRouter.get("/profile", authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

// Update current user profile
userRouter.put(
  "/profile",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { firstname, lastname, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstname, lastname, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  })
);

// Change password
userRouter.put(
  "/change-password",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  })
);

// Refresh token
userRouter.post("/refresh", authenticateToken, (req, res) => {
  const token = generateToken(req.user._id);
  res.json({ token });
});

// Logout (client-side token removal, but we can add token blacklisting if needed)
userRouter.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Logout successful" });
});

export default userRouter;
