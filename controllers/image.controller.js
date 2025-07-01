import express from "express";
import { asyncHandler } from "../lib/utils/async.handler.js";
import Image from "../models/Image.js";

const imageRouter = express.Router();

// Update image
imageRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const image = await Image.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  })
);

// Delete image
imageRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json({ message: "Image deleted successfully" });
  })
);

export default imageRouter;
