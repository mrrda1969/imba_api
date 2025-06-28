import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "a_good_man_is_hard_to_find";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export default generateToken;
