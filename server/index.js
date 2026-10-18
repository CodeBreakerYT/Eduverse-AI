const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { callGemini, OFFLINE_REPLY } = require("../shared/tutorPrompt");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/tutor", async (req, res) => {
  try {
    const { message, profile, history } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    if (!GEMINI_API_KEY) {
      return res.json({ reply: OFFLINE_REPLY });
    }

    const reply = await callGemini({ message, profile, history, apiKey: GEMINI_API_KEY });
    res.json({ reply });
  } catch (err) {
    console.error(err);
    if (err.status) return res.status(err.status).json({ error: err.message, detail: err.detail });
    res.status(500).json({ error: "internal error" });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true, geminiConfigured: !!GEMINI_API_KEY }));

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`EduVerse AI tutor proxy listening on :${PORT}`));
