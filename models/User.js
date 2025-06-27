const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const User = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: {
    type: String,
    enum: ["agent", "client"],
  },
  password: String,
});

User.pre("save", function (next) {
  const user = this;

  // if the data is not modified
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", User);
