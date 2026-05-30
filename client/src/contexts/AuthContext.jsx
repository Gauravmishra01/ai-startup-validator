/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { api, fetchCsrfToken, setCsrfToken } from "../api/client";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

const isUnauthorized = (error) => error?.response?.status === 401;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfReady, setCsrfReady] = useState(false);
  const [error, setError] = useState(null);

  const bootstrapSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const csrfToken = await fetchCsrfToken();
      setCsrfToken(csrfToken);
      setCsrfReady(true);

      try {
        const { data } = await api.get("/api/auth/me");
        setUser(data.user);
      } catch (sessionError) {
        if (!isUnauthorized(sessionError)) {
          setError("Unable to verify your session.");
          console.error("Session bootstrap failed:", sessionError);
        }
        setUser(null);
      }
    } catch (bootstrapError) {
      console.error("CSRF bootstrap failed:", bootstrapError);
      setError("Unable to prepare the authentication session.");
      setCsrfReady(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrapSession();
  }, []);

  const refreshUser = async () => {
    const { data } = await api.get("/api/auth/me");
    setUser(data.user);
    return data.user;
  };

  const signup = async ({ fullName, email, password, confirmPassword }) => {
    const { data } = await api.post("/api/auth/signup", {
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (data?.csrfToken) {
      setCsrfToken(data.csrfToken);
    }

    setUser(data.user);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });

    if (data?.csrfToken) {
      setCsrfToken(data.csrfToken);
    }

    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    await bootstrapSession();
  };

  const value = {
    user,
    loading,
    csrfReady,
    error,
    isAuthenticated: Boolean(user),
    refreshUser,
    signup,
    login,
    logout,
    bootstrapSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
