import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const Home = () => {
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    // Navigate to Create page AND send the idea text
    navigate("/create", { state: { initialIdea: idea } });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>

      <div className="max-w-3xl text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
          <Sparkles className="w-4 h-4" /> AI-Powered Startup Validator
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Is your startup idea <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            worth building?
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Don't waste months coding. Get instant feedback on market size,
          competitors, and risks.
        </p>

        {/* The Magic Input Box */}
        <div className="w-full max-w-xl mx-auto mt-8 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
          <div className="relative flex bg-slate-800 rounded-xl p-2 border border-slate-700">
            <input
              type="text"
              placeholder="e.g. A subscription service for coffee lovers..."
              className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder-slate-500"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
            <button
              onClick={handleStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              Validate <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
