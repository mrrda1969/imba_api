import { Schema as _Schema, model } from "mongoose";
import { hash as _hash, compare } from "bcrypt";

const Schema = _Schema;

const User = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
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

  _hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

User.methods.verifyPassword = async function (password) {
  return await compare(password, this.password);
};

export default model("User", User);
