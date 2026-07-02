import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import aiRoutes from "./routes/aiRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/ai", aiRoutes);
app.use("/api/decks", deckRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

export default app;
