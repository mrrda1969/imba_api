import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

const User = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "agent", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

User.pre("save", function (next) {
  const user = this;

  // if the data is not modified
  if (!user.isModified("password")) {
    return next();
  }

  hash(user.password, 10, (err, hash) => {
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

User.index({ role: 1 });

// virtual for full name
User.virtual("fullName").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

// ensuring serialized fields
User.set("toJSON", { virtuals: true });

export default model("User", User);
