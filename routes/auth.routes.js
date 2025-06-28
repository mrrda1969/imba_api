const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authKey = require("../lib/authKey");
const passport = require("passport");

const router = express.Router();
// sign up
router.post("/signup", (req, res) => {
  const data = req.body;

  let user = new User({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: data.role,
    password: data.password,
  });

  user.save().then(() => {
    const token = jwt.sign({ _id: user._id }, authKey.jwtSecretKey);
    res.status(201).json({
      token: token,
      user: {
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// login
router.post("/login", (req, res, next) => {
  const data = req.body;

  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return err(next);
      }

      if (!user) {
        res.status(401).json(info);
        return;
      }

      // token
      const token = jwt.sign({ _id: user._id }, authKey.jwtSecretKey);
      res.json({
        token: token,
        role: user.role,
      });
    }
  )(req, res, next);
});

module.exports = router;
