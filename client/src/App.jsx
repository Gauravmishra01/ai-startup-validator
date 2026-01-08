import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IdeaDetails from "./pages/IdeaDetails";
import CreateIdea from "./pages/CreateIdea";
import Home from "./pages/Home"; // Import the new Home page

// This component wraps the internal app pages (Dashboard, Create, etc)
// to give them the white navbar and container.
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="p-4 bg-white shadow-sm flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🚀 Validator AI
        </Link>
        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Idea
          </Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto p-6">{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Home Page - Full Screen Dark Mode */}
        <Route path="/" element={<Home />} />

        {/* Protected App Pages - Wrapped in AppLayout */}
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
