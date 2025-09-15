import express from "express";
import cors from "cors";
import prisma from "./config/prisma";
import authRoutes from "./routes/authRoutes";
import prayerRoutes from "./routes/prayerRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
// Configure CORS with an allowlist for local and production origins
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://iqamah-time.vercel.app",
];

// Allow comma-separated origins via env CORS_ORIGINS to override/extend
const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, ...envAllowedOrigins])
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false, // <– automatically sends 204 response for OPTIONS
  optionsSuccessStatus: 200, // <– explicitly OK for legacy browsers
}));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (added for form data if needed)

// Routes
app.use("/auth", authRoutes);
app.use("/prayers", prayerRoutes);

// Health check (kept your existing one, but simplified for clarity)
app.get("/", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ time: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

// Global error handler (optional enhancement for better error responses)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown (disconnect Prisma on exit)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
