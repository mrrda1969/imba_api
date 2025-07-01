import express from "express";
import { asyncHandler } from "../lib/utils/async.handler.js";
import Agency from "../models/Agency.js";

const agencyRouter = express();

// Get all agencies
agencyRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const agencies = await Agency.find()
      .populate("parent_agency_id", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Agency.countDocuments();

    res.json({
      agencies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  })
);

// Get agency by ID
agencyRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const agency = await Agency.findById(req.params.id).populate(
      "parent_agency_id",
      "name"
    );

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }
    res.json(agency);
  })
);

// Create new agency
agencyRouter.post(
  "/add",
  asyncHandler(async (req, res) => {
    const agency = new Agency(req.body);
    await agency.save();
    await agency.populate("parent_agency_id", "name");
    res.status(201).json(agency);
  })
);

// Update agency
agencyRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("parent_agency_id", "name");

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }
    res.json(agency);
  })
);

// Delete agency
agencyRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const agency = await Agency.findByIdAndDelete(req.params.id);
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }
    res.json({ message: "Agency deleted successfully" });
  })
);

// Get child agencies
agencyRouter.get(
  "/children",
  asyncHandler(async (req, res) => {
    const childAgencies = await Agency.find({
      parent_agency_id: req.params.id,
    });
    res.json(childAgencies);
  })
);

export default agencyRouter;
