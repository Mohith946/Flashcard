import { Router } from "express";
import {
  listDecks,
  getDeck,
  deleteDeck,
  updateCardProgress,
} from "../controllers/deckController.js";

const router = Router();

router.get("/", listDecks);
router.get("/:id", getDeck);
router.delete("/:id", deleteDeck);
router.patch("/:deckId/cards/:cardId", updateCardProgress);

export default router;
