// server/routes/chat.js
const express = require("express");
const router = express.Router();
const { getAnswer } = require("../services/openrouterService");

// POST /api/chat - Receives a question and returns an answer from OpenAI.
router.post("/", async (req, res) => {
  try {
    const { question, history } = req.body;
    console.log("Received question:", question);
    if (!question) {
      return res.status(400).json({ answer: "Question is required." });
    }
    const answer = await getAnswer(question, history);
    res.json({ answer });
  } catch (error) {
    console.error("Error fetching answer:", error);
    res
      .status(500)
      .json({ answer: "There was an error processing your request." });
  }
});

module.exports = router;
