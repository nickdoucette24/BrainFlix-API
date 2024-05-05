const express = require("express");
const app = express();
const cors = require("cors");
const videosRoute = require("./routes/videos");
require("dotenv").config();

// ! dotenv
const { PORT } = process.env;

// ! CORS
app.use(express.json());
app.use(cors());

// ! Static Images
app.use(express.static("public"));

// ! Router
app.use("/videos", videosRoute);

// ! Server Startup
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
  console.log("Press Control + C to close the server.");
});
