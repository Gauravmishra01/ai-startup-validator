require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Groq = require("groq-sdk");
const Idea = require("./models/Idea");

const app = express();
app.use(express.json());

// Configure CORS to allow requests from Vercel frontend
const corsOptions = {
  origin: [
    "https://ai-startup-validator-five.vercel.app",
    "http://localhost:5173", // for local development
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("🚀 AI Startup Validator Backend is Running!");
});

// Configure Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// --- ROUTES ---

// API validation endpoint (used by frontend)
app.post("/api/validate", async (req, res) => {
  const { title, description, startupName } = req.body;

  // Accept both 'title' and 'startupName' for backwards compatibility
  const ideaTitle = title || startupName;

  if (!ideaTitle || !description) {
    return res.status(400).json({ 
      error: "Both startup name/title and description are required",
      missingFields: {
        title: !ideaTitle,
        description: !description
      }
    });
  }

  // Validate input lengths to prevent abuse and API token limit issues
  if (ideaTitle.length > 200) {
    return res.status(400).json({
      error: "Startup name/title is too long",
      details: "Please limit the title to 200 characters or less"
    });
  }

  if (description.length > 2000) {
    return res.status(400).json({
      error: "Description is too long",
      details: "Please limit the description to 2000 characters or less"
    });
  }

  // Sanitize input to prevent prompt injection
  const sanitize = (str) => {
    return str
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/["'`]/g, '') // Remove quotes that could break the prompt
      .substring(0, 2000); // Additional safety limit
  };

  const sanitizedTitle = sanitize(ideaTitle);
  const sanitizedDescription = sanitize(description);

  try {
    const prompt = `
      You are an expert startup consultant. Analyze the startup idea below and return a structured JSON object.

      Input: { "title": "${sanitizedTitle}", "description": "${sanitizedDescription}" }

      Output JSON Fields:
      - problem (string)
      - customer (persona)
      - market (short overview)
      - competitors (3 competitors, each with name + difference)
      - tech_stack (4-6 recommended techs)
      - risk_level (Low / Medium / High)
      - profitability_score (0-100)
      - justification (brief reasoning)

      RETURN ONLY RAW JSON. NO MARKDOWN.
    `;

    // --- CALL GROQ API ---
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // ✅ Stable Groq model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const aiText = completion.choices[0].message.content.trim();

    let analysisData;
    try {
      const clean = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      analysisData = JSON.parse(clean);
    } catch (err) {
      console.error("JSON Parse Error:\n", aiText);
      return res.status(500).json({ 
        error: "Failed to parse AI response",
        details: "The AI returned an invalid format. Please try again."
      });
    }

    // Save to DB
    const newIdea = new Idea({
      title: ideaTitle,
      description,
      analysis: analysisData,
    });

    await newIdea.save();
    res.status(201).json(newIdea);
  } catch (err) {
    console.error("Groq Error:", err);
    // Log full error for debugging, but send sanitized error to client
    res.status(500).json({ 
      error: "AI Analysis Failed",
      details: "Unable to analyze the startup idea. Please try again later."
    });
  }
});

// 1. GET /ideas - List all ideas
app.get("/ideas", async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /ideas/:id - Get single idea details
app.get("/ideas/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: "Idea not found" });
  }
});

// 3. POST /ideas - Analyze using Groq + Save
app.post("/ideas", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description required" });
  }

  try {
    const prompt = `
      You are an expert startup consultant. Analyze the startup idea below and return a structured JSON object.

      Input: { "title": "${title}", "description": "${description}" }

      Output JSON Fields:
      - problem (string)
      - customer (persona)
      - market (short overview)
      - competitors (3 competitors, each with name + difference)
      - tech_stack (4-6 recommended techs)
      - risk_level (Low / Medium / High)
      - profitability_score (0-100)
      - justification (brief reasoning)

      RETURN ONLY RAW JSON. NO MARKDOWN.
    `;

    // --- CALL GROQ API ---
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // ✅ Stable Groq model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const aiText = completion.choices[0].message.content.trim();

    let analysisData;
    try {
      const clean = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      analysisData = JSON.parse(clean);
    } catch (err) {
      console.error("JSON Parse Error:\n", aiText);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    // Save to DB
    const newIdea = new Idea({
      title,
      description,
      analysis: analysisData,
    });

    await newIdea.save();
    res.status(201).json(newIdea);
  } catch (err) {
    console.error("Groq Error:", err);
    res.status(500).json({ error: "AI Analysis Failed" });
  }
});

// 4. DELETE /ideas/:id
app.delete("/ideas/:id", async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
