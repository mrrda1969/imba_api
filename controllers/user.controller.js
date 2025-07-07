// User controller
const bcrypt = require("bcrypt");
const { User } = require("../models/api.models");

// Get all users (admin only)
const getAllUsers = async (req, res) => {
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
};

// Get user by ID (admin or self)
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

// Create new user (admin only)
const createUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    ...req.body,
    password: hashedPassword,
  });
  await user.save();
  const userResponse = user.toObject();
  delete userResponse.password;
  res.status(201).json(userResponse);
};

// Update user (admin or self)
const updateUser = async (req, res) => {
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
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User deleted successfully" });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
