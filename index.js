const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config();

const app = express();
const router = express.Router();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to cluster"))
  .catch((error) => console.error(error));

//setting up middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// logger
app.use(logger("dev"));

// seting up routing
app.use("/auth", require("./routes/auth.routes"));
app.use(
  "/",
  router.get("/", (req, res) => {
    res.send("Hello there");
  })
);

app.listen(process.env.PORT || 5200, () =>
  console.log(`Server listening on post ${process.env.PORT}`)
);
