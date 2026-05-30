import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Rocket } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const AuthLayout = ({
  eyebrow,
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkLabel,
}) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.15),_transparent_35%),linear-gradient(180deg,#0f172a_0%,#111827_55%,#030712_100%)] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between pb-6">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                AI Startup Validator
              </p>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Validator AI
              </h1>
            </div>
          </Link>
          <ThemeToggle />
        </header>

        <main className="grid flex-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 dark:shadow-black/30 sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(99,102,241,0.14),transparent_35%,rgba(6,182,212,0.12))]" />
            <div className="relative z-10 max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {eyebrow}
              </div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {subtitle}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
                    <Rocket className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Protected workspace
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Keep your startup ideas tied to your account with secure,
                    session-based access.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-300">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Security-first auth
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Password hashing, CSRF protection, and rate limits are
                    enabled end-to-end.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-950/85 sm:p-8">
              {children}
              <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                {footerText}{" "}
                <Link
                  to={footerLink}
                  className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {footerLinkLabel}
                </Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
