import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://ai-startup-validator-pol2.onrender.com/ideas")
      .then((res) => {
        setIdeas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch ideas:", err);
        setError("Unable to load your ideas. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Ideas</h1>
      {ideas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600 text-lg">No ideas yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <Link key={idea._id} to={`/idea/${idea._id}`}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500">
                <h3 className="text-xl font-bold">{idea.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {idea.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  {idea.analysis?.profitability_score !== undefined ? (
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        idea.analysis.profitability_score > 70
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Score: {idea.analysis.profitability_score}/100
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600">
                      Processing...
                    </span>
                  )}
                  <span className="text-sm text-gray-400">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
