import { v4 as uuid } from "uuid";

// --- In-memory "database" -------------------------------------------------
// Swap this file for real DB calls (Prisma/Mongoose/etc.) when you're ready.
// Every function below is async so the swap doesn't ripple into controllers.

const decks = new Map(); // deckId -> { id, title, sourceText, createdAt, cards: [] }

export const DeckStore = {
  async createDeck({ title, sourceText, cards }) {
    const id = uuid();
    const deck = {
      id,
      title,
      sourceText,
      createdAt: new Date().toISOString(),
      cards: cards.map((c) => ({
        id: uuid(),
        front: c.front,
        back: c.back,
        known: false,
        reviewCount: 0,
      })),
    };
    decks.set(id, deck);
    return deck;
  },

  async getDeck(id) {
    return decks.get(id) || null;
  },

  async listDecks() {
    return Array.from(decks.values()).map(({ id, title, createdAt, cards }) => ({
      id,
      title,
      createdAt,
      cardCount: cards.length,
    }));
  },

  async deleteDeck(id) {
    return decks.delete(id);
  },

  async updateCard(deckId, cardId, updates) {
    const deck = decks.get(deckId);
    if (!deck) return null;
    const card = deck.cards.find((c) => c.id === cardId);
    if (!card) return null;
    Object.assign(card, updates);
    return card;
  },
};
