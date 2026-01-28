import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

const CreateIdea = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Form state
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Prefill description if passed from Home page
  useEffect(() => {
    if (location.state?.initialIdea) {
      setDescription(location.state.initialIdea);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startupName || !description) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://ai-startup-validator-pol2.onrender.com/api/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: startupName, // ✅ correct variable
            description: description,
          }),
        },
      );

      // Check response status first
      if (!res.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          // If JSON parsing fails, use status text
          throw new Error(`Server error: ${res.statusText || res.status}`);
        }
        
        // Handle error response from server
        const errorMessage = errorData.error || "Server error occurred";
        const errorDetails = errorData.details || "";
        throw new Error(`${errorMessage}${errorDetails ? ": " + errorDetails : ""}`);
      }

      // Now safely parse successful response
      const data = await res.json();
      console.log("AI Data:", data);

      setAnalysis(data);

      // Optional: navigate to result page if ID exists
      if (data?._id) {
        navigate(`/idea/${data._id}`);
      }
    } catch (error) {
      console.error("Error:", error);
      
      // Provide more specific error messages
      let errorMsg;
      
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorMsg = "Unable to connect to the server. Please check your internet connection or try again later.";
      } else {
        // Use the backend error message directly if it's already descriptive
        errorMsg = error.message || "An unexpected error occurred. Please try again.";
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Create New Idea' }]} />
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Validate Startup Idea
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get AI-powered insights in seconds
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Startup Name */}
            <div>
              <label 
                htmlFor="startup-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Startup Name
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">
                  ({startupName.length}/200)
                </span>
              </label>
              <input
                id="startup-name"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/40 outline-none transition-all"
                placeholder="e.g. Uber for Cats"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                maxLength={200}
                required
                aria-required="true"
              />
            </div>

            {/* Description */}
            <div>
              <label 
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                What does it do?
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">
                  ({description.length}/2000)
                </span>
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/40 outline-none h-40 resize-none transition-all"
                placeholder="Describe your product, target audience, and problem you are solving..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                required
                aria-required="true"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                loading
                  ? "bg-gray-400 dark:bg-gray-600 cursor-wait"
                  : "bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
              }`}
              aria-label={loading ? "Analyzing your idea" : "Analyze idea"}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Analyze Idea
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIdea;
