import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IdeaDetails from "./pages/IdeaDetails";
import CreateIdea from "./pages/CreateIdea";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <nav className="p-4 bg-white shadow-sm flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            🚀 Validator AI
          </Link>
          <Link
            to="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Idea
          </Link>
        </nav>
        <div className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateIdea />} />
            <Route path="/idea/:id" element={<IdeaDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
