import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IdeaDetails from "./pages/IdeaDetails";
import CreateIdea from "./pages/CreateIdea";
import Home from "./pages/Home"; // Import the new Home page
import ThemeToggle from "./components/ThemeToggle";
import FeedbackModal from "./components/FeedbackModal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { useAuth } from "./contexts/AuthContext";

// This component wraps the internal app pages (Dashboard, Create, etc)
// to give them the white navbar and container.
const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
      <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl transition-colors duration-200 dark:border-gray-800 dark:bg-gray-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xl font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            aria-label="Home - Validator AI"
          >
            🚀 Validator AI
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg px-4 py-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400"
              aria-label="Go to dashboard"
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className="rounded-lg bg-primary-600 px-4 py-2 text-white shadow-md transition-all duration-200 hover:bg-primary-700 hover:shadow-lg"
              aria-label="Create new idea"
            >
              + New Idea
            </Link>
            <div className="hidden rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300 sm:block">
              {user?.fullName || "Signed in"}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="Log out"
            >
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl animate-fade-in p-6">{children}</div>
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
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        {/* Protected App Pages - Wrapped in AppLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreateIdea />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/idea/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <IdeaDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
