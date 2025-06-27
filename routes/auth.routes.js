const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authKey = require("../lib/authKey");

const router = express.Router();

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
        email: user.email,
        role: user.role,
      },
    });
  });
});

module.exports = router;
