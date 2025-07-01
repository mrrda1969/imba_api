import { model, Schema } from "mongoose";

const Image = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    listing_id: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

Image.index({ listing_id: 1 });

export default model("Image", Image);
