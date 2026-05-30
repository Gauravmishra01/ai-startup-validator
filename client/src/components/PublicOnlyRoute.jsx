import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const PublicOnlyRoute = ({ children, redirectTo = "/dashboard" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300">
        <div className="text-center">
          <Loader2
            className="mx-auto h-10 w-10 animate-spin text-primary-600 dark:text-primary-400"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm">Preparing your session...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
