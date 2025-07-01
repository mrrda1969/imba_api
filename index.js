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

app.listen(process.env.PORT || 5200, () =>
  console.log(`Server listening on post ${process.env.PORT}`)
);
