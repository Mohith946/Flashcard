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
    <div className="container">
      <Link to="/" className="muted">← Back to decks</Link>

      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      {!error && !deck && <p className="muted">Loading...</p>}

      {deck && (
        <>
          <h1>{deck.title}</h1>
          <FlashCardDeck deck={deck} />
        </>
      )}
    </div>
  );
}
