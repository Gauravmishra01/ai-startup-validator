import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IdeaDetails from "./pages/IdeaDetails";
import CreateIdea from "./pages/CreateIdea";
import Home from "./pages/Home";

// A wrapper layout for the functional pages (Dashboard, Create, etc.)
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              to="/"
              className="text-xl font-bold text-indigo-600 flex items-center gap-2"
            >
              🚀 Validator.ai
            </Link>
            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + New Idea
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* The Home Page (Full Screen / Dark Mode) */}
        <Route path="/" element={<Home />} />

        {/* The App Pages (Wrapped in the white layout) */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/create"
          element={
            <AppLayout>
              <CreateIdea />
            </AppLayout>
          }
        />
        <Route
          path="/idea/:id"
          element={
            <AppLayout>
              <IdeaDetails />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
