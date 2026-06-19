import "dotenv/config";
import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import studentRoutes from "./routes/student.routes.js";
import { requireAuth, requireRole } from "./middleware/auth.middleware.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
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

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/student", requireAuth, requireRole("STUDENT"), studentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
