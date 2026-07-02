import { DeckStore } from "../models/store.js";

export async function listDecks(req, res, next) {
  try {
    const decks = await DeckStore.listDecks();
    res.json(decks);
  } catch (err) {
    next(err);
  }
}

export async function getDeck(req, res, next) {
  try {
    const deck = await DeckStore.getDeck(req.params.id);
    if (!deck) return res.status(404).json({ error: "Deck not found" });
    res.json(deck);
  } catch (err) {
    next(err);
  }
}

export async function deleteDeck(req, res, next) {
  try {
    const deleted = await DeckStore.deleteDeck(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Deck not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateCardProgress(req, res, next) {
  try {
    const { deckId, cardId } = req.params;
    const { known } = req.body;

    const card = await DeckStore.updateCard(deckId, cardId, {
      known: Boolean(known),
      reviewCount: undefined, // left for a real spaced-repetition implementation
    });

    if (!card) return res.status(404).json({ error: "Card not found" });
    res.json(card);
  } catch (err) {
    next(err);
  }
}
