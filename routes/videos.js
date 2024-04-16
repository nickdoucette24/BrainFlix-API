const express = require("express");
const router = express.Router();

const videos = [];

// ! Server Endpoints
// GET and POST for /videos
router
  .route("/")
  .get((req, res) => {
    res.send("GET request received for Videos Array");
  })
  .post((req, res) => {
    res.send("POST request received for new video");
  });

// GET for /videos/:id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.send("GET request received for Video ID and Details");
});

// Delete a Comment
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;
});

module.exports = router;
