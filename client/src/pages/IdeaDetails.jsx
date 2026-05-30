import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  Code,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Building2,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { api } from "../api/client";

const IdeaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/ideas/${id}`)
      .then((res) => {
        setIdea(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch idea details:", err);
        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError(
          "Unable to load the idea details. The idea may not exist or the server is unavailable.",
        );
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <Loader2
          className="inline-block animate-spin h-12 w-12 text-primary-600 dark:text-primary-400"
          aria-hidden="true"
        />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading idea details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" role="alert">
        <AlertCircle
          className="inline-block h-12 w-12 text-red-600 dark:text-red-400 mb-4"
          aria-hidden="true"
        />
        <div className="text-red-600 dark:text-red-400 text-xl mb-4">Error</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-12" role="status">
        <div className="text-gray-600 dark:text-gray-400 text-xl mb-4">
          🔍 Not Found
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          The requested idea could not be found.
        </p>
      </div>
    );
  }

  const analysis = idea?.analysis || {};

  // --- SAFE HELPERS ---
  const safeText = (value) => {
    if (!value) return "No data available";
    if (typeof value === "string") return value;
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const safeCustomer = () => {
    if (!analysis.customer) return "No customer data";
    return typeof analysis.customer === "string"
      ? analysis.customer
      : analysis.customer.persona || JSON.stringify(analysis.customer);
  };

  const safeCompetitors = () => {
    if (!analysis.competitors) return [];
    if (Array.isArray(analysis.competitors)) {
      return analysis.competitors.map((c) =>
        typeof c === "string" ? c : `${c.name} — ${c.difference}`,
      );
    }
    return [String(analysis.competitors)];
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70)
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (score >= 40)
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: idea.title },
        ]}
      />

      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors group"
        aria-label="Back to dashboard"
      >
        <ArrowLeft
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          aria-hidden="true"
        />
        Back to Dashboard
      </button>

      <div className="space-y-6">
        <header className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{idea.title}</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            {idea.description}
          </p>
        </header>

        {/* Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-xl border-2 transition-all ${getScoreColor(analysis.profitability_score)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-900/50">
                <TrendingUp className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-1">
              Profitability Score
            </p>
            <p
              className="text-5xl font-bold"
              aria-label={`Profitability score: ${analysis.profitability_score || 0} out of 100`}
            >
              {analysis.profitability_score ?? "—"}
              <span className="text-2xl">/100</span>
            </p>
          </div>

          <div
            className={`p-6 rounded-xl border-2 transition-all ${getRiskColor(analysis.risk_level)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-900/50">
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-1">
              Risk Level
            </p>
            <p
              className="text-5xl font-bold"
              aria-label={`Risk level: ${analysis.risk_level || "Unknown"}`}
            >
              {analysis.risk_level ?? "—"}
            </p>
          </div>
        </div>

        {/* Analysis Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-8 space-y-8">
            <Section
              icon={<Target className="w-5 h-5" />}
              title="Problem & Market Analysis"
              content={`${safeText(analysis.problem)}\n\n${safeText(analysis.market)}`}
            />

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <Section
                icon={<Users className="w-5 h-5" />}
                title="Target Customer"
                content={safeCustomer()}
              />
            </div>

            {/* Competitors */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Building2
                    className="w-5 h-5 text-primary-600 dark:text-primary-400"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                  Competitors
                </h3>
              </div>
              {safeCompetitors().length > 0 ? (
                <ul className="space-y-3" role="list">
                  {safeCompetitors().map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
                    >
                      <CheckCircle
                        className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 italic">
                  No competitor data available
                </p>
              )}
            </div>

            {/* Tech Stack */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                  <Code
                    className="w-5 h-5 text-accent-600 dark:text-accent-400"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                  Recommended Tech Stack
                </h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {(analysis.tech_stack || []).length > 0 ? (
                  (analysis.tech_stack || []).map((t, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 border border-primary-200 dark:border-primary-700 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    No tech stack recommendations
                  </p>
                )}
              </div>
            </div>

            {/* Justification */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-l-4 border-primary-500">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                  AI Analysis Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {safeText(analysis.justification)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Component
const Section = ({ icon, title, content }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed pl-11">
      {content}
    </p>
  </div>
);

export default IdeaDetails;
