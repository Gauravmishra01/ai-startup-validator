import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, csrfReady, user, error: authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectPath = useMemo(
    () => location.state?.from?.pathname || "/dashboard",
    [location.state],
  );

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      setMessage("Login successful. Redirecting...");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.details ||
        error?.response?.data?.error ||
        "Unable to log in.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to continue validating ideas"
      subtitle="Access your saved startup analyses, create new ideas, and keep your workspace secure across refreshes."
      footerText="Need an account?"
      footerLink="/signup"
      footerLinkLabel="Create one"
    >
      <div className="mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
          <LogIn className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Login
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Use your email and password to continue.
        </p>
      </div>

      {message ? (
        <div
          className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {message}
        </div>
      ) : null}

      {authError ? (
        <div
          className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
          role="status"
        >
          {authError}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 dark:bg-slate-900 dark:text-white ${fieldErrors.email ? "border-red-400" : "border-gray-300 dark:border-gray-700"}`}
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {fieldErrors.email ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 dark:bg-slate-900 dark:text-white ${fieldErrors.password ? "border-red-400" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {fieldErrors.password ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Remember me
          </label>
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Need an account?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading || !csrfReady}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {loading
            ? "Signing in..."
            : csrfReady
              ? "Sign in"
              : "Preparing session..."}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
