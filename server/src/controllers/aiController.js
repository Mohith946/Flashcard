import { generateFlashcards } from "../services/aiService.js";
import { DeckStore } from "../models/store.js";

export async function generateDeck(req, res, next) {
  try {
    const { topicOrText, count } = req.body;

    if (!topicOrText || typeof topicOrText !== "string" || !topicOrText.trim()) {
      return res.status(400).json({ error: "topicOrText is required" });
    }

    const cardCount = Math.min(Math.max(Number(count) || 10, 1), 30);

    const { title, cards } = await generateFlashcards({
      topicOrText: topicOrText.trim(),
      count: cardCount,
    });

    if (cards.length === 0) {
      return res.status(502).json({ error: "AI did not return any usable flashcards" });
    }

    const deck = await DeckStore.createDeck({
      title,
      sourceText: topicOrText.trim(),
      cards,
    });

    res.status(201).json(deck);
  } catch (err) {
    next(err);
  }
}
