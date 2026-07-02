import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FlashCardDeck from "../components/flashcards/FlashCardDeck";
import { getDeck } from "../services/deckService";

export default function DeckView() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDeck(id)
      .then(setDeck)
      .catch(() => setError("Deck not found."));
  }, [id]);

  return (
    <>
      {/* Header Bar */}
      <header className="app-header">
        <Link to="/" className="delete-btn" style={{ padding: "0.25rem", color: "var(--text)" }} title="Back to Decks">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <div className="logo-container">
          <svg viewBox="0 0 100 100" width="32" height="32" style={{ transform: "scaleX(-1)" }}>
            <path d="M50 15 C62 15, 75 25, 80 40 C82 45, 85 48, 80 52 C70 58, 60 62, 50 72 C40 82, 30 85, 25 78 C20 70, 25 55, 30 45 C35 35, 40 15, 50 15 Z" fill="var(--accent)" />
            <path d="M80 40 L92 42 L80 47 Z" fill="#e89e3a" />
            <circle cx="68" cy="38" r="2.5" fill="#fff" />
            <circle cx="68" cy="38" r="1.2" fill="#2c2924" />
          </svg>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="phone-content">
        {error && (
          <p style={{ color: "var(--accent)", fontWeight: 600, textAlign: "center", marginTop: "2rem" }}>
            {error}
          </p>
        )}
        {!error && !deck && (
          <p className="muted" style={{ textAlign: "center", marginTop: "2rem" }}>
            Loading deck...
          </p>
        )}

        {deck && (
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{deck.title}</h2>
            <FlashCardDeck deck={deck} />
          </div>
        )}
      </main>
    </>
  );
}
