require("dotenv").config();
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const bcrypt = require("bcryptjs");
const Groq = require("groq-sdk");
const Idea = require("./models/Idea");
const User = require("./models/User");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const mongoUri = process.env.MONGO_URI?.trim();
const sessionCookieName =
  process.env.SESSION_COOKIE_NAME || "ai_startup_validator_session";

const corsOrigins = [
  process.env.CLIENT_ORIGIN,
  ...(process.env.CLIENT_ORIGINS ? process.env.CLIENT_ORIGINS.split(",") : []),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ai-startup-validator-five.vercel.app",
]
  .filter(Boolean)
  .map((origin) => origin.trim());

const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const createCsrfToken = () => crypto.randomBytes(32).toString("hex");

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Groq({ apiKey });
};

const getSessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

const ensureCsrfToken = (req) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = createCsrfToken();
  }

  return req.session.csrfToken;
};

const getRequestCsrfToken = (req) =>
  req.get("x-csrf-token") || req.body?._csrf || req.query?._csrf || "";

const sanitizeText = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/["'`]/g, "")
    .trim();

const normalizeEmail = (value) => sanitizeText(value).toLowerCase();

const validatePasswordStrength = (password) => {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  if (!checks.every(Boolean)) {
    return "Password must be at least 8 characters and include upper case, lower case, number, and symbol.";
  }

  return null;
};

const serializeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const createSessionForUser = (req, user) =>
  new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        return reject(error);
      }

      req.session.userId = user._id.toString();
      req.session.csrfToken = createCsrfToken();

      req.session.save((saveError) => {
        if (saveError) {
          return reject(saveError);
        }

        return resolve({
          user: serializeUser(user),
          csrfToken: req.session.csrfToken,
        });
      });
    });
  });

const getAuthenticatedUser = async (req) => {
  if (!req.session.userId) {
    return null;
  }

  return User.findById(req.session.userId).select(
    "fullName email role createdAt",
  );
};

const requireAuth = async (req, res, next) => {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({
        error: "Authentication required",
        details: "Please sign in to continue.",
      });
    }

    req.authUser = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

const analyzeStartupIdea = async (title, description) => {
  const groq = getGroqClient();

  if (!groq) {
    throw {
      status: 503,
      error: "AI analysis is unavailable",
      details: "Set GROQ_API_KEY in server/.env to enable startup analysis.",
    };
  }

  if (title.length > 200) {
    throw {
      status: 400,
      error: "Startup name/title is too long",
      details: "Please limit the title to 200 characters or less",
    };
  }

  if (description.length > 2000) {
    throw {
      status: 400,
      error: "Description is too long",
      details: "Please limit the description to 2000 characters or less",
    };
  }

  const sanitizedTitle = sanitizeText(title).substring(0, 200);
  const sanitizedDescription = sanitizeText(description).substring(0, 2000);

  const prompt = `
    You are an expert startup consultant. Analyze the startup idea below and return a structured JSON object.

    Input: { "title": "${sanitizedTitle}", "description": "${sanitizedDescription}" }

    Output JSON Fields:
    - problem (string)
    - customer (persona)
    - market (short overview)
    - competitors (3 competitors, each with name + difference)
    - tech_stack (4-6 recommended techs)
    - risk_level (Low / Medium / High)
    - profitability_score (0-100)
    - justification (brief reasoning)

    RETURN ONLY RAW JSON. NO MARKDOWN.
  `;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const aiText = completion.choices[0].message.content.trim();

  try {
    const clean = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("JSON Parse Error:\n", aiText);
    throw {
      status: 500,
      error: "Failed to parse AI response",
      details: "The AI returned an invalid format. Please try again.",
    };
  }
};

const createIdea = async (userId, title, description) => {
  const analysisData = await analyzeStartupIdea(title, description);

  return Idea.create({
    user: userId,
    title,
    description,
    analysis: analysisData,
  });
};

const buildIdeaPayload = async (req, res) => {
  const title = sanitizeText(req.body.title || req.body.startupName);
  const description = sanitizeText(req.body.description);

  if (!title || !description) {
    return res.status(400).json({
      error: "Both startup name/title and description are required",
      missingFields: {
        title: !title,
        description: !description,
      },
    });
  }

  const result = await createIdea(req.authUser._id, title, description);
  return res.status(201).json(result);
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts",
    details: "Please wait a few minutes and try again.",
  },
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many signup attempts",
    details: "Please wait an hour and try again.",
  },
});

const ideaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many idea requests",
    details: "Please slow down and try again shortly.",
  },
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(hpp());
app.set("trust proxy", 1);

app.use(
  session({
    name: sessionCookieName,
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    store: mongoUri
      ? MongoStore.create({
          mongoUrl: mongoUri,
          ttl: 60 * 60 * 24 * 7,
        })
      : undefined,
    cookie: getSessionCookieOptions(),
  }),
);

app.use((req, res, next) => {
  ensureCsrfToken(req);
  return next();
});

app.use((req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    return next();
  }

  const requestToken = getRequestCsrfToken(req);
  if (!requestToken || requestToken !== req.session.csrfToken) {
    return res.status(403).json({
      error: "Invalid CSRF token",
      details: "Please refresh the page and try again.",
    });
  }

  return next();
});

app.get("/", (req, res) => {
  res.send("🚀 AI Startup Validator Backend is Running!");
});

app.get("/api/auth/csrf", (req, res) => {
  return res.json({ csrfToken: ensureCsrfToken(req) });
});

app.get("/api/auth/me", async (req, res) => {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return res.status(401).json({
      error: "Not authenticated",
      details: "Please sign in to continue.",
    });
  }

  return res.json({ user: serializeUser(user) });
});

app.post("/api/auth/signup", signupLimiter, async (req, res) => {
  const fullName = sanitizeText(req.body.fullName);
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const confirmPassword = String(req.body.confirmPassword || "");

  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Missing required fields",
      details: "Full name, email, password, and confirm password are required.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Passwords do not match",
      details: "Please make sure both password fields match.",
    });
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return res.status(400).json({
      error: "Weak password",
      details: passwordError,
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      error: "Email already registered",
      details: "Please log in with that email address or use a different one.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  try {
    const payload = await createSessionForUser(req, user);
    return res.status(201).json(payload);
  } catch (error) {
    console.error("Signup session error:", error);
    return res.status(500).json({
      error: "Unable to create session",
      details:
        "Your account was created, but the session could not be established.",
    });
  }
});

app.post("/api/auth/login", loginLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({
      error: "Missing credentials",
      details: "Email and password are required.",
    });
  }

  const user = await User.findOne({ email }).select(
    "+password fullName email role createdAt",
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
      details: "The email or password is incorrect.",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({
      error: "Invalid credentials",
      details: "The email or password is incorrect.",
    });
  }

  try {
    const payload = await createSessionForUser(req, user);
    return res.json(payload);
  } catch (error) {
    console.error("Login session error:", error);
    return res.status(500).json({
      error: "Unable to create session",
      details: "Please try signing in again.",
    });
  }
});

app.post("/api/auth/logout", requireAuth, async (req, res) => {
  return req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Logout failed",
        details: "Please try again.",
      });
    }

    res.clearCookie(sessionCookieName, getSessionCookieOptions());
    return res.json({ message: "Logged out successfully" });
  });
});

app.post("/api/validate", requireAuth, ideaLimiter, async (req, res) => {
  try {
    return await buildIdeaPayload(req, res);
  } catch (error) {
    console.error("Validation Error:", error);

    if (error.status) {
      return res
        .status(error.status)
        .json({ error: error.error, details: error.details });
    }

    return res.status(500).json({
      error: "AI Analysis Failed",
      details: "Unable to analyze the startup idea. Please try again later.",
    });
  }
});

app.get("/ideas", requireAuth, async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.authUser._id }).sort({
      createdAt: -1,
    });
    return res.json(ideas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/ideas/:id", requireAuth, async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.params.id,
      user: req.authUser._id,
    });

    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    return res.json(idea);
  } catch (error) {
    return res.status(404).json({ error: "Idea not found" });
  }
});

app.post("/ideas", requireAuth, ideaLimiter, async (req, res) => {
  try {
    return await buildIdeaPayload(req, res);
  } catch (error) {
    console.error("Ideas Error:", error);

    if (error.status) {
      return res
        .status(error.status)
        .json({ error: error.error, details: error.details });
    }

    return res.status(500).json({
      error: "AI Analysis Failed",
      details: "Unable to analyze the startup idea. Please try again later.",
    });
  }
});

app.delete("/ideas/:id", requireAuth, async (req, res) => {
  try {
    const deletedIdea = await Idea.findOneAndDelete({
      _id: req.params.id,
      user: req.authUser._id,
    });

    if (!deletedIdea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Delete failed" });
  }
});

app.use((error, req, res, next) => {
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS blocked",
      details: "This origin is not allowed to access the API.",
    });
  }

  console.error(error);
  return res.status(500).json({
    error: "Server error",
    details: "An unexpected error occurred.",
  });
});

const PORT = process.env.PORT || 5000;

if (!mongoUri) {
  console.warn("MONGO_URI is missing. Starting without a MongoDB connection.");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  mongoose
    .connect(mongoUri)
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    });
}
