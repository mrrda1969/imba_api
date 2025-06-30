import mongoose, { SchemaTypes } from "mongoose";

const Schema = mongoose.Schema();

const Listing = new Schema({
  listingName: {
    type: String,
    required: true,
  },
  city: String,
  surbub: String,
  price: {
    type: SchemaTypes.Double,
    required: true,
  },
  listingAgent: String,
  description: String,
  images: {
    id: SchemaTypes.ObjectId,
    url: String,
  },
});
