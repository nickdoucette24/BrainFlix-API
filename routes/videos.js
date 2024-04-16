const express = require("express");
const router = express.Router();

const videos = [];

// ! Server Endpoints
// Videos
app
  .route("/videos")
  .get((req, res, next) => {
    res.send("GET request received for Videos Array");

    next();
  })
  .post((req, res) => {
    res.send("POST request received for new video");
  });

// Video Details
app.get("/videos/:id", (req, res, next) => {
  res.send("GET request received for Video ID and Details");

  next();
});

// Delete a Comment
app.delete("/videos/:videoId/comments/:commentId", (req, res, next) => {
  next();
});

module.exports = router;
