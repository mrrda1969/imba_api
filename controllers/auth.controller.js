import generateToken from "../lib/jwt.auth.js";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, role, password } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
    });

    await user
      .save()
      .then(() => {
        const token = generateToken(user._id);

        res.status(201).json({
          token: token,
          message: "User created successfully",
        });
      })
      .catch((err) => {
        res.json({ message: err.message });
      });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = user.verifyPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = generateToken(user._id);

    res.json({
      token: token,
      info: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};
