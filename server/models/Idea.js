const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    analysis: {
      problem: String,

      // FIX: allow BOTH object or string
      customer: mongoose.Schema.Types.Mixed,

      market: String,

      // FIX: competitors may be an array of objects or strings
      competitors: [mongoose.Schema.Types.Mixed],

      tech_stack: [String],
      risk_level: String,
      profitability_score: Number,
      justification: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", IdeaSchema);
