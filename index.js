import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import apiRouter from "./routes/api.routes.js";

dotenv.config();

const app = express();
const router = express.Router();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to cluster"))
  .catch((error) => console.error(error));

//setting up middleware
app.use(cors());
app.use(express.json());

// logger
app.use(logger("dev"));

// seting up routing
app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use(
  "/",
  router.get("/", (req, res) => {
    res.send("Hello there");
  })
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error.stack);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (error.code === 11000) {
    return res.status(400).json({ message: "Duplicate field value" });
  }

  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT || 5200, () =>
  console.log(`Server listening on post ${process.env.PORT}`)
);
