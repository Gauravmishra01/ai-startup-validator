import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../contexts/AuthContext";

const passwordChecks = (password) => ({
  length: password.length >= 8,
  lower: /[a-z]/.test(password),
  upper: /[A-Z]/.test(password),
  number: /\d/.test(password),
  symbol: /[^A-Za-z0-9]/.test(password),
});

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const { signup, csrfReady, user, error: authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectPath = useMemo(
    () => location.state?.redirectTo || "/dashboard",
    [location.state],
  );
  const initialIdea = location.state?.initialIdea;
  const checks = useMemo(() => passwordChecks(password), [password]);
  const strengthScore = Object.values(checks).filter(Boolean).length;

  useEffect(() => {
    if (user) {
      navigate(redirectPath, {
        replace: true,
        state: initialIdea ? { initialIdea } : undefined,
      });
    }
  }, [user, navigate, redirectPath, initialIdea]);

  const validate = () => {
    const nextErrors = {};
    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters long.";
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (strengthScore < 5) {
      nextErrors.password =
        "Use upper and lower case letters, numbers, and a symbol.";
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
      await signup({ fullName, email, password, confirmPassword });
      setMessage("Account created successfully. Redirecting...");
      navigate(redirectPath, {
        replace: true,
        state: initialIdea ? { initialIdea } : undefined,
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.details ||
        error?.response?.data?.error ||
        "Unable to create account.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <AuthLayout
      eyebrow="Create your workspace"
      title="Set up your validator account"
      subtitle="Sign up once to save startup ideas, protect your reports, and keep everything synced across sessions."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Sign in"
    >
      <div className="mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
          <UserPlus className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Create account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Use a strong password so your startup analyses stay secure.
        </p>
      </div>

      {message ? (
        <div
          className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200"
          role="status"
        >
          {message}
        </div>
      ) : null}

      {authError ? (
        <div
          className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
          role="alert"
        >
          {authError}
        </div>
      ) : null}

      {initialIdea ? (
        <div className="mb-5 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800 dark:border-primary-900/50 dark:bg-primary-950/30 dark:text-primary-200">
          We’ll carry your startup idea into the create flow after signup.
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="signup-name"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 dark:bg-slate-900 dark:text-white ${fieldErrors.fullName ? "border-red-400" : "border-gray-300 dark:border-gray-700"}`}
            placeholder="Alex Johnson"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          {fieldErrors.fullName ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.fullName}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 dark:bg-slate-900 dark:text-white ${fieldErrors.password ? "border-red-400" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="Create a strong password"
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

          <div className="mt-3 space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Password strength</span>
              <span>
                {strengthLabels[Math.max(0, strengthScore - 1)] || "Very weak"}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-colors ${index < strengthScore ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700"}`}
                />
              ))}
            </div>
            <div className="grid gap-2 text-xs text-gray-600 dark:text-gray-400 sm:grid-cols-2">
              {[
                ["length", "At least 8 characters"],
                ["lower", "Lowercase letter"],
                ["upper", "Uppercase letter"],
                ["number", "Number"],
                ["symbol", "Symbol"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 ${checks[key] ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"}`}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 dark:bg-slate-900 dark:text-white ${fieldErrors.confirmPassword ? "border-red-400" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmation password"
                  : "Show confirmation password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.confirmPassword}
            </p>
          ) : null}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-slate-900/60 dark:text-gray-400">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            required
          />
          <span>
            I agree to create a secure account for saving my startup validation
            results.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !csrfReady}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {loading
            ? "Creating account..."
            : csrfReady
              ? "Create account"
              : "Preparing session..."}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-gray-500 dark:text-gray-500">
        By signing up you get protected, session-based access to your own idea
        reports.
      </p>
    </AuthLayout>
  );
};

export default Signup;
