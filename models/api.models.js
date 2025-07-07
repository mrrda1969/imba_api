const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
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

// Agency Schema
const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    whatsapp_number: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    primary_suburb: {
      type: String,
      trim: true,
    },
    allowed_suburbs: {
      type: [String],
      default: [],
    },
    parent_agency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },
    logo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Image Schema
const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Listing Schema
const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    suburb: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    listing_agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing_agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
agencySchema.index({ name: 1 });
listingSchema.index({ city: 1, suburb: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ listing_agent: 1 });
listingSchema.index({ listing_agency: 1 });
imageSchema.index({ listing_id: 1 });

// Add virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

// Add virtual to populate images for listings
listingSchema.virtual("listingImages", {
  ref: "Image",
  localField: "_id",
  foreignField: "listing_id",
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true });
listingSchema.set("toJSON", { virtuals: true });

// Pre-save middleware for password hashing (you'll need bcrypt)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    next();
  } catch (error) {
    next(error);
  }
});

// Create models
const User = mongoose.model("User", userSchema);
const Agency = mongoose.model("Agency", agencySchema);
const Listing = mongoose.model("Listing", listingSchema);
const Image = mongoose.model("Image", imageSchema);

module.exports = {
  User,
  Agency,
  Listing,
  Image,
};
