import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CreateIdea = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Grab data passed from Home page
  useEffect(() => {
    if (location.state?.initialIdea) {
      setDescription(location.state.initialIdea);
    }
  }, [location]);

  // 2. Handle the submission
  const handleSubmit = async () => {
    if (!description) {
      alert("Please describe your idea first.");
      return;
    }
    setLoading(true);

    try {
      // REPLACE THIS URL with your actual backend URL
      // If running locally, it is usually: http://localhost:5000/api/ideas
      // If deployed on Vercel, use your production backend URL
      const API_URL =
        "https://ai-startup-validator-pol2.onrender.com/api/ideas";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: startupName || "Untitled Idea",
          description: description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Navigate to dashboard to see the new entry
        navigate("/dashboard");
      } else {
        alert("Error analyzing idea: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Failed to connect to the server. Make sure your backend is running!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Analysis</h1>
        <p className="text-gray-500 mb-8">
          Tell us about your startup concept.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name (Optional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="My Awesome Startup"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Idea Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-40 resize-none"
              placeholder="What problem are you solving? Who is it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all
              ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
              }`}
          >
            {loading ? "Analyzing Market..." : "Run Validation Analysis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIdea;
