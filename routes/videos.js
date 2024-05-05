const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// ! Path to JSON File
const dataFilePath = path.join(__dirname, "../data/videos.json");

// ! Server Endpoints
// GET and POST for /videos
router
  .route("/")
  .get((req, res) => {
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      const videos = JSON.parse(data);
      res.json(videos);
    } catch (error) {
      console.error("Error retrieving data: ", error);
      res.status(500).json({ error: "Server-Side Error" });
    }
  })
  .post((req, res) => {
    const { title, channel } = req.body;
    const newId = uuidv4();
    const image = `https://www.test.com/`;
    const newVideo = {
      id: newId,
      title,
      channel,
      image,
    };

    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      const videos = JSON.parse(data);
      videos.push(newVideo);
      fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
      res.status(201).json(newVideo);
    } catch (error) {
      console.error("Error posting new video: ", error);
      res.status(500).json({ error: "Server-Side Error" });
    }
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
