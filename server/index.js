// server/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const chatRoute = require("./routes/chat");
app.use("/api/chat", chatRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
