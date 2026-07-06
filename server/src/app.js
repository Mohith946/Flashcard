import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import aiRoutes from "./routes/aiRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "1mb" }));

// Serve static assets from the client build folder
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/ai", aiRoutes);
app.use("/api/decks", deckRoutes);

// Fallback all non-API requests to React's index.html for SPA routing
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

export default app;
