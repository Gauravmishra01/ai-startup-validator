import { useState } from "react";
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
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const [idea, setIdea] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // UPDATED FUNCTION: Passes the idea text to the next page
  const handleStart = () => {
    navigate("/create", { state: { initialIdea: idea } });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-primary-500 selection:text-white">
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <div className="">
                <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
                🚀 Validator AI
              </span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
              >
                Features
              </a>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
                aria-label="Go to dashboard"
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Go to Dashboard
              </button>
              <ThemeToggle />
              <button
                onClick={handleStart}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Start validating your idea"
              >
                Validate Idea
              </button>
            </div>

            <button
              className="md:hidden text-slate-300 p-2 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-slate-800 animate-fade-in">
              <a
                href="#features"
                className="block text-slate-400 hover:text-white transition-colors px-4 py-2 rounded hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full text-left text-slate-400 hover:text-white transition-colors px-4 py-2 rounded hover:bg-slate-800 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Dashboard
              </button>
              <div className="px-4">
                <ThemeToggle />
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleStart();
                }}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-all"
              >
                Validate Idea
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-4xl mx-auto text-center z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6" role="status">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              AI-Powered Analysis v2.0 Live
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Validate your startup idea <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                before you build.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Stop guessing. Get instant, data-driven feedback on market size,
              competitors, and potential risks using advanced AI agents.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200" aria-hidden="true"></div>
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-800 rounded-xl p-2 border border-slate-700 shadow-2xl gap-2 sm:gap-0">
                <label htmlFor="idea-input" className="sr-only">
                  Describe your startup idea
                </label>
                <input
                  id="idea-input"
                  type="text"
                  placeholder="Describe your startup idea (e.g., 'Uber for dog walking')..."
                  className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 rounded-lg"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  aria-label="Startup idea description"
                />
                <button
                  onClick={handleStart}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                  aria-label="Start validation"
                >
                  Validate <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
              <article className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-primary-500/50 transition-all duration-200 hover:shadow-xl">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="text-primary-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-3">Market Potential</h3>
                <p className="text-slate-400">
                  Real-time TAM, SAM, and SOM calculations based on current web
                  data.
                </p>
              </article>
              <article className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-accent-500/50 transition-all duration-200 hover:shadow-xl">
                <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Target className="text-accent-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-3">Competitor Intel</h3>
                <p className="text-slate-400">
                  Identify who is already solving this problem and uncover their
                  weaknesses.
                </p>
              </article>
              <article className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-rose-500/50 transition-all duration-200 hover:shadow-xl">
                <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="text-rose-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-3">Risk Assessment</h3>
                <p className="text-slate-400">
                  AI plays "Devil's Advocate" to find critical flaws in your
                  logic.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-12 text-center bg-slate-950" role="contentinfo">
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
