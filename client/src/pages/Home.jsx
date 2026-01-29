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
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="fixed w-full z-50 bg-white border-b border-gray-200 shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <div className="">
                <Sparkles className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-primary-600">
                🚀 Validator AI
              </span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                Features
              </a>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Go to dashboard"
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Dashboard
              </button>
              <ThemeToggle />
              <button
                onClick={handleStart}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Start validating your idea"
              >
                Validate Idea
              </button>
            </div>

            <button
              className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-200">
              <a
                href="#features"
                className="block text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full text-left text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
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
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
              >
                Validate Idea
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        <section className="relative pt-32 pb-20 px-4 bg-gray-50">
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6" role="status">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              AI-Powered Analysis v2.0 Live
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
              Validate your startup idea <br />
              <span className="text-primary-600">
                before you build.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Get instant, data-driven feedback on market size,
              competitors, and potential risks using AI.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl p-2 border border-gray-300 shadow-lg gap-2 sm:gap-0">
                <label htmlFor="idea-input" className="sr-only">
                  Describe your startup idea
                </label>
                <input
                  id="idea-input"
                  type="text"
                  placeholder="Describe your startup idea (e.g., 'Uber for dog walking')..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 rounded-lg"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  aria-label="Startup idea description"
                />
                <button
                  onClick={handleStart}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Start validation"
                >
                  Validate <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Deep Dive Analysis
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Get comprehensive insights to validate your startup idea
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Market Potential</h3>
                <p className="text-gray-600">
                  Calculate market size and opportunity based on current data.
                </p>
              </article>
              <article className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Competitor Analysis</h3>
                <p className="text-gray-600">
                  Identify existing solutions and discover market gaps.
                </p>
              </article>
              <article className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Risk Assessment</h3>
                <p className="text-gray-600">
                  Identify potential challenges and risks in your business model.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-12 text-center bg-gray-50" role="contentinfo">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gray-500">
            © 2025 Validator.ai. Built by Gauravmishra01.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
