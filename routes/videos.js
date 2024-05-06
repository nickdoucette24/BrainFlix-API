const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// ! Path to JSON File
const dataFilePath = path.join(__dirname, "../data/videos.json");

// ! Server Endpoints
// GET and POST videos
router
  .route("/")
  .get((req, res) => {
    // Read data from file and return as object with specified key
    // value pairs
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      const videos = JSON.parse(data);
      const filteredVideoData = videos.map((video) => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      }));
      res.json(filteredVideoData);
    } catch (error) {
      console.error("Error retrieving data: ", error);
      res.status(500).json({ error: "Server-Side Error" });
    }
  })
  .post((req, res) => {
    // Take data out of req body and store as a newVideo object
    const { title, description, image } = req.body;
    const newId = uuidv4();
    const newVideo = {
      id: newId,
      title,
      description,
      channel: "You",
      image,
    };

    // Read and Write to JSON File
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

// GET video details
router.get("/:id", (req, res) => {
  const videoId = req.params.id;
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const videos = JSON.parse(data);
    const selectedVideo = videos.find((video) => video.id === videoId);
    if (!selectedVideo) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(selectedVideo);
  } catch (error) {
    console.error("Error retrieving data: ", error);
    res.status(500).json({ error: "Server-Side error" });
  }
});

// GET and POST comments
router
  .route("/:id/comments")
  .get((req, res) => {
    const videoId = req.params.id;
    // Read data from file and check if params id matches
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      const videos = JSON.parse(data);
      const selectedVideo = videos.find((video) => video.id === videoId);
      if (!selectedVideo) {
        return res.status(404).json({ error: "Video not found" });
      }
      const comments = selectedVideo.comments || [];
      res.json(comments);
    } catch (error) {
      console.error("Could not retrieve data: ", error);
      res.status(500).json({ error: "Server-Side error" });
    }
  })
  .post((req, res) => {
    // Get data from req body and params, assign to newComment object
    // along with unique ID and timestamp
    const videoId = req.params.id;
    const { name, comment } = req.body;
    const newId = uuidv4();
    const newComment = {
      name,
      comment,
      id: newId,
      timestamp: Date.now(),
    };

    // Read and Write to JSON File
    // Check index of videos array and mark as selectedVideo so we can pull comments array
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      const videos = JSON.parse(data);
      const videoIndex = videos.findIndex((video) => video.id === videoId);
      if (videoIndex === -1) {
        return res.status(404).json({ error: "Video not found" });
      }
      const selectedVideo = videos[videoIndex];
      // PUSH newComment to correct array of comments on associated video
      selectedVideo.comments = selectedVideo.comments || [];
      selectedVideo.comments.push(newComment);
      videos[videoIndex] = selectedVideo;
      fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
      res.status(201).json(newComment);
    } catch (error) {
      console.error("Unable to retrieve data: ", error);
      res.status(500).json({ error: "Server-Side error" });
    }
  });

// Delete a Comment
router.delete("/:videoId/comments/:commentId", (req, res) => {
  // Grab params variables
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;

  // Find index of videos array then find index of the comments array
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const videos = JSON.parse(data);
    const videoIndex = videos.findIndex((video) => video.id === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }
    const selectedVideo = videos[videoIndex];
    const commentIndex = selectedVideo.comments.findIndex(
      (comment) => comment.id === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }
    // Remove specific comment in the comments array and write to file
    selectedVideo.comments.splice(commentIndex, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
    res.send("Comment Deleted Successfully!");
  } catch (error) {
    console.error("Unable to delete comment: ", error);
    res.status(500).json({ error: "Server-Side error" });
  }
});

module.exports = router;
