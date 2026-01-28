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
import ThemeToggle from "./components/ThemeToggle";
import FeedbackModal from "./components/FeedbackModal";

// This component wraps the internal app pages (Dashboard, Create, etc)
// to give them the white navbar and container.
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-200">
      <nav className="p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 z-30 transition-colors duration-200">
        <Link 
          to="/" 
          className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          aria-label="Home - Validator AI"
        >
          🚀 Validator AI
        </Link>
        <div className="flex gap-3 items-center">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            aria-label="Go to dashboard"
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Create new idea"
          >
            + New Idea
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-6 animate-fade-in">{children}</div>
      <FeedbackModal />
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
