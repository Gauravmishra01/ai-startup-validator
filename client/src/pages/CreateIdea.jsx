import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Validate Startup Idea
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Startup Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Startup Name
              <span className="text-gray-400 text-xs ml-2">
                ({startupName.length}/200)
              </span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="e.g. Uber for Cats"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What does it do?
              <span className="text-gray-400 text-xs ml-2">
                ({description.length}/2000)
              </span>
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none h-40 resize-none"
              placeholder="Describe your product, target audience, and problem you are solving..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading
                ? "bg-blue-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
            }`}
          >
            {loading ? "Analyzing with AI..." : "Analyze Idea"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateIdea;
