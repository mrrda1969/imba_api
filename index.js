const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to cluster"))
  .catch((error) => console.error(error));

app.listen(process.env.PORT || 5200, () =>
  console.log(`Server listening on post ${process.env.PORT}`)
);
