import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Lightbulb } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { api } from "../api/client";

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/ideas")
      .then((res) => {
        setIdeas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch ideas:", err);
        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError("Unable to load your ideas. Please try again later.");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <Loader2
          className="inline-block animate-spin h-12 w-12 text-primary-600 dark:text-primary-400"
          aria-hidden="true"
        />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading your ideas...
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

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Your Ideas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage all your validated startup ideas
        </p>
      </header>

      {ideas.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors">
          <Lightbulb
            className="inline-block h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
            aria-hidden="true"
          />
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            No ideas yet. Create your first one!
          </p>
          <Link
            to="/create"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            aria-label="Create your first idea"
          >
            + Create First Idea
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {ideas.map((idea) => (
            <Link
              key={idea._id}
              to={`/idea/${idea._id}`}
              className="group"
              aria-label={`View details for ${idea.title}`}
            >
              <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 border-l-4 border-l-primary-500 hover:border-l-primary-600 dark:hover:border-l-primary-400 h-full">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {idea.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2 mb-4">
                  {idea.description}
                </p>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  {idea.analysis?.profitability_score !== undefined ? (
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        idea.analysis.profitability_score > 70
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : idea.analysis.profitability_score > 40
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}
                      aria-label={`Profitability score: ${idea.analysis.profitability_score} out of 100`}
                    >
                      Score: {idea.analysis.profitability_score}/100
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 animate-pulse">
                      Processing...
                    </span>
                  )}
                  <time
                    className="text-sm text-gray-500 dark:text-gray-500"
                    dateTime={idea.createdAt}
                  >
                    {new Date(idea.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
