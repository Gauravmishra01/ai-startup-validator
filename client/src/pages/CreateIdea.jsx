import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Icon

const CreateIdea = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming backend is on port 5000
      await axios.post("http://localhost:5000/ideas", formData);
      navigate("/");
    } catch (error) {
      console.error("Error submitting idea", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Validate Startup Idea</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Startup Name
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full p-2 border rounded-md"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            What does it do?
          </label>
          <textarea
            required
            rows="4"
            className="mt-1 block w-full p-2 border rounded-md"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <button
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Analyze Idea"}
        </button>
      </form>
    </div>
  );
};
export default CreateIdea;
