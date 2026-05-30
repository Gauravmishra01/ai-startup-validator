import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center py-12">
        <div>
          <Loader2
            className="inline-block animate-spin h-12 w-12 text-primary-600 dark:text-primary-400"
            aria-hidden="true"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
