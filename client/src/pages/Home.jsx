import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeckGenerator from "../components/flashcards/DeckGenerator";
import { listDecks, deleteDeck } from "../services/deckService";

export default function Home() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setDecks(await listDecks());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id) {
    await deleteDeck(id);
    refresh();
  }

  return (
    <div className="container">
      <h1>AI Flashcard Generator</h1>

      <DeckGenerator />

      <h2 style={{ marginTop: "2rem" }}>Your decks</h2>
      {loading && <p className="muted">Loading...</p>}
      {!loading && decks.length === 0 && (
        <p className="muted">No decks yet — generate one above.</p>
      )}

      {decks.map((deck) => (
        <div className="deck-list-item" key={deck.id}>
          <div>
            <Link to={`/decks/${deck.id}`} style={{ color: "inherit", fontWeight: 600 }}>
              {deck.title}
            </Link>
            <p className="muted" style={{ margin: 0 }}>{deck.cardCount} cards</p>
          </div>
          <button className="secondary" onClick={() => handleDelete(deck.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
