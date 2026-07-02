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
          <svg viewBox="0 0 100 100" width="36" height="36" style={{ display: "block" }}>
            {/* Bulb Glow */}
            <path d="M50 22 C37 22, 28 32, 28 47 C28 58, 34 65, 39 71 C42 75, 42 78, 43 81 L57 81 C58 78, 58 75, 61 71 C66 65, 72 58, 72 47 C72 32, 63 22, 50 22 Z" fill="#ffd54f" />
            <path d="M50 25 C40 25, 31 33, 31 47 C31 56, 36 62, 41 68 C44 72, 45 74, 45 77 L55 77 C55 74, 56 72, 59 68 C64 62, 69 56, 69 47 C69 33, 60 25, 50 25 Z" fill="#ffca28" />

            {/* Screw base */}
            <path d="M43 81 H57 V83 C57 84, 56 85, 55 85 H45 C44 85, 43 84, 43 83 Z" fill="#b0bec5" />
            <path d="M44 85 H56 V87 C56 88, 55 89, 54 89 H46 C45 89, 44 88, 44 87 Z" fill="#90a4ae" />
            <path d="M46 89 H54 C55 89, 55 91, 54 92 C53 93, 47 93, 46 92 C45 91, 45 89, 46 89 Z" fill="#78909c" />

            {/* Cap Underneath Support */}
            <path d="M36 43 L36 48 C36 54, 64 54, 64 48 L64 43 Z" fill="#0d47a1" />

            {/* Mortarboard Diamond Top */}
            <polygon points="10,34 50,14 90,34 50,54" fill="#0d47a1" />
            <polygon points="15,34 50,17 85,34 50,51" fill="none" stroke="#00b0ff" strokeWidth="2" />

            {/* Tassel */}
            <circle cx="50" cy="34" r="2.5" fill="#0a388e" />
            <path d="M50 34 C58 34, 66 38, 66 46 L66 54" fill="none" stroke="#0a388e" strokeWidth="2" strokeLinecap="round" />
            <rect x="64" y="54" width="4" height="8" rx="1" fill="#0a388e" />
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
