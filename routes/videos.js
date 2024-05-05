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
    const { title, description } = req.body;
    const newId = uuidv4();
    const image = `https://www.test.com/`;
    const newVideo = {
      id: newId,
      title,
      description,
      image: image,
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

// GET video details
router.get("/:id", (req, res) => {
  const id = req.params.id;
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const videos = JSON.parse(data);
    const selectedVideo = videos.find((video) => video.id === id);
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
  .route("/videos/:id/comments")
  .get((req, res) => {
    const id = req.params.id;
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      const videos = JSON.parse(data);
      const selectedVideo = videos.find((video) => video.id === id);
      const comments = selectedVideo.comments;
      if (!selectedVideo) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(comments);
    } catch (error) {
      console.error("Could not retrieve data: ", error);
      res.status(500).json({ error: "Server-Side error" });
    }
  })
  .post((req, res) => {
    const id = req.params.id;
    const { name, comment } = req.body;
    const newId = uuidv4();
    const newComment = {
      name,
      comment,
      id: newId,
      timestamp: new Date(),
    };

    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      const videos = JSON.parse(data);
      const selectedVideo = videos.find((video) => video.id === id);
      const comments = selectedVideo.comments;

      comments.push(newComment);
      fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
      res.status(201).json(newComment);
    } catch (error) {
      console.error("Unable to retrieve data: ", error);
      res.status(500).json({ error: "Server-Side error" });
    }
  });

// Delete a Comment
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const videos = JSON.parse(data);
    const selectedVideo = videos.find((video) => video.id === videoId);
    let commentList = selectedVideo.comments;

    if (!selectedVideo) {
      return res.status(404).json({ error: "Video not found" });
    }

    const commentToDelete = commentList.find(
      (comment) => comment.id === commentId
    );

    if (!commentToDelete) {
      return res.status(404).json({ error: "Comment not found" });
    }

    commentList = commentList.filter((comment) => comment.id !== commentId);
    fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
    res.send("Comment Deleted Successfully!");
  } catch (error) {
    console.error("Unable to delete comment: ", error);
    res.status(500).json({ error: "Server-Side error" });
  }
});

module.exports = router;
