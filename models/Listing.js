import { Schema, model } from "mongoose";

const Listing = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing_agency: {
      type: Schema.Types.ObjectId,
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

Listing.index({ city: 1, suburb: 1 });
Listing.index({ price: 1 });
Listing.index({ listing_agent: 1 });
Listing.index({ listing_agency: 1 });

/// populate listing images
Listing.virtual("listingImages", {
  ref: "Image",
  localField: "_id",
  foreignField: "listing_id",
});

/// ensuring serialized fields
Listing.set("toJSON", { virtuals: true });

export default model("Listing", Listing);
