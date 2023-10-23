const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AutoConnect Server is Running!");
});

app.listen(port, () => {
  console.log(`AutoConnect ser is running on port ${port}`);
});