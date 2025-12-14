import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/ideas").then((res) => setIdeas(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Ideas</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {ideas.map((idea) => (
          <Link key={idea._id} to={`/idea/${idea._id}`}>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500">
              <h3 className="text-xl font-bold">{idea.title}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {idea.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    idea.analysis.profitability_score > 70
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  Score: {idea.analysis.profitability_score}/100
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
