import { Schema, model } from "mongoose";

const Agency = new Schema(
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
      type: Schema.Types.ObjectId,
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

Agency.index({ name: 1 });

export default model("Agency", Agency);
