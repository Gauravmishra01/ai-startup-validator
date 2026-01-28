import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Target,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

const Home = () => {
  const [idea, setIdea] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // UPDATED FUNCTION: Passes the idea text to the next page
  const handleStart = () => {
    navigate("/create", { state: { initialIdea: idea } });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                🚀 Validator AI
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </button>
              <button
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Validate Idea
              </button>
            </div>

            <button
              className="md:hidden text-slate-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI-Powered Analysis v2.0 Live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Validate your startup idea <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              before you build.
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Stop guessing. Get instant, data-driven feedback on market size,
            competitors, and potential risks using advanced AI agents.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-slate-800 rounded-xl p-2 border border-slate-700 shadow-2xl">
              <input
                type="text"
                placeholder="Describe your startup idea (e.g., 'Uber for dog walking')..."
                className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder-slate-500"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />
              <button
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                Validate <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Deep Dive Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Market Potential</h3>
              <p className="text-slate-400">
                Real-time TAM, SAM, and SOM calculations based on current web
                data.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Competitor Intel</h3>
              <p className="text-slate-400">
                Identify who is already solving this problem and uncover their
                weaknesses.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-rose-500/50 transition-colors">
              <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-rose-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Risk Assessment</h3>
              <p className="text-slate-400">
                AI plays "Devil's Advocate" to find critical flaws in your
                logic.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-12 text-center bg-slate-950">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-slate-600">
            © 2025 Validator.ai. Built by Gauravmishra01.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
