const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Express is running!");
});

app.get("/", (req, res) => {
  res.send("Express is running!");
});

app.get("/", (req, res) => {
  res.send("Express is running!");
});

app.listen(8080, () => {
  console.log("Server Started on http://localhost:8080");
  console.log("Press Control + C to close the server.");
});
