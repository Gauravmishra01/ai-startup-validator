import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CreateIdea = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State for form fields
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Checks if data was passed from the Home page
  useEffect(() => {
    if (location.state && location.state.initialIdea) {
      setDescription(location.state.initialIdea);
    }
  }, [location]);

  const handleSubmit = async () => {
    if (!startupName || !description) {
      alert("Please fill in both fields");
      return;
    }

    setLoading(true);

    // TODO: Replace this with your actual API call to your backend
    // Example:
    // const response = await fetch('http://localhost:5000/api/validate', { ... })

    console.log("Analyzing:", { startupName, description });

    // Simulating a delay for effect
    setTimeout(() => {
      setLoading(false);
      // Navigate to results page (if you have one)
      // navigate(`/idea/123`);
      alert("Analysis Started! (Connect your backend here)");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Validate Startup Idea
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Startup Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="e.g. Uber for Cats"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What does it do?
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none h-40 resize-none"
              placeholder="Describe your product, target audience, and problem you are solving..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all
              ${
                loading
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
              }`}
          >
            {loading ? "Analyzing with AI..." : "Analyze Idea"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIdea;
