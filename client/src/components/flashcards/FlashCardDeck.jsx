import { useState } from "react";
import FlashCard from "./FlashCard";
import { markCard } from "../../services/deckService";

export default function FlashCardDeck({ deck }) {
  const [index, setIndex] = useState(0);
  const [cards, setCards] = useState(deck.cards);

  const current = cards[index];
  const knownCount = cards.filter((c) => c.known).length;

  async function handleMark(known) {
    await markCard(deck.id, current.id, known);
    setCards((prev) =>
      prev.map((c) => (c.id === current.id ? { ...c, known } : c))
    );
    goNext();
  }

  function goNext() {
    setIndex((i) => (i + 1 < cards.length ? i + 1 : i));
  }

  function goPrev() {
    setIndex((i) => (i > 0 ? i - 1 : i));
  }

  if (!current) return <p>This deck has no cards.</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <span className="muted">
          Card {index + 1} of {cards.length}
        </span>
        <span className="muted">{knownCount} known</span>
      </div>

      <FlashCard key={current.id} card={current} />

      <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button className="secondary-btn" onClick={goPrev} disabled={index === 0}>
          ← Prev
        </button>
        <button className="secondary-btn" style={{ flex: 1 }} onClick={() => handleMark(false)}>
          Still learning
        </button>
        <button className="primary-btn" style={{ flex: 1 }} onClick={() => handleMark(true)}>
          Got it ✓
        </button>
        <button className="secondary-btn" onClick={goNext} disabled={index === cards.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
