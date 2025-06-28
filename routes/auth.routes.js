import { body } from "express-validator";
import { login, signup } from "../controllers/auth.controller.js";
import express from "express";

const authRouter = express.Router();
// sign up
authRouter.post(
  "/signup",
  [
    body("first_name").not().isEmpty().withMessage("First name is required"),
    body("last_name").not().isEmpty().withMessage("Last name is required"),
    body("email").isEmail(),
    body("role").isIn(["agent", "client"]),
    body("password").isLength({ min: 6 }),
  ],
  signup
);

// login
authRouter.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  login
);

export default authRouter;
