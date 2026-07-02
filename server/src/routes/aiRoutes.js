import { Router } from "express";
import { generateDeck } from "../controllers/aiController.js";

const router = Router();

// POST /api/ai/generate  { topicOrText, count }
router.post("/generate", generateDeck);

export default router;
