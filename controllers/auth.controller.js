// Auth controller
const bcrypt = require("bcrypt");
const { User } = require("../models/api.models");
const { generateToken } = require("../utils/token.util");

// Register new user
const register = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    phone,
    role = "user",
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    phone,
    role,
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate token
  const token = generateToken(user._id);

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};

// Get current user profile
const getProfile = (req, res) => {
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
};

// Update current user profile
const updateProfile = async (req, res) => {
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
};

// Change password
const changePassword = async (req, res) => {
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
};

// Refresh token
const refreshToken = (req, res) => {
  const token = generateToken(req.user._id);
  res.json({ token });
};

// Logout (client-side token removal)
const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
};
