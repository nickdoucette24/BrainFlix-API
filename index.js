const express = require("express");
const app = express();
const cors = require("cors");
const videosRoute = require("./routes/videos");

// ! Static Images
app.use(express.static("./public/images"));

// ! CORS
app.use(cors());

// ! Router
app.use("/videos", videosRoute);

// ! GET Endpoints
app.get("/", (req, res, next) => {
  res.send("GET request received");

  next();
});

// ! Server Startup
app.listen(8080, () => {
  console.log("Server Started on http://localhost:8080");
  console.log("Press Control + C to close the server.");
});
