require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Groq = require("groq-sdk");
const Idea = require("./models/Idea");

const app = express();
app.use(express.json());
app.use(cors());

// Default Route
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
  .catch((err) => console.error("MongoDB Error:", err));

// --- ROUTES (Updated with /api prefix) ---

// 1. GET /api/ideas - List all ideas
app.get("/api/ideas", async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/ideas/:id - Get single idea
app.get("/api/ideas/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: "Idea not found" });
  }
});

// 3. POST /api/ideas - Analyze using Groq + Save
app.post("/api/ideas", async (req, res) => {
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
      
      RETURN ONLY RAW JSON. NO MARKDOWN. NO CODE BLOCKS.
    `;

    // --- CALL GROQ API ---
    const completion = await groq.chat.completions.create({
      // ✅ FIX: Use a valid Groq model ID (Llama 3.3 is fast & reliable)
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const aiText = completion.choices[0].message.content.trim();
    
    // Improved JSON cleaning to prevent crashes
    let analysisData;
    try {
      const clean = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      analysisData = JSON.parse(clean);
    } catch (err) {
      console.error("JSON Parse Error. AI Response:", aiText);
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
    console.error("Groq/Server Error:", err);
    res.status(500).json({ error: "AI Analysis Failed: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));