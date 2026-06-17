import express from "express";
import path from "path";
import { requireAuth, requireRole } from "./middleware/auth.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
]);

app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/videos", express.static(path.resolve(process.cwd(), "videos")));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", requireAuth, requireRole("ADMIN"), adminRoutes);
app.use("/api/student", requireAuth, requireRole("STUDENT"), studentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
