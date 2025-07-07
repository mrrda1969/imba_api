// Token util
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { generateToken };
