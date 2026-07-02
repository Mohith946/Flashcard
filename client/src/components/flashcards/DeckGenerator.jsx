import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateDeck } from "../../services/deckService";

export default function DeckGenerator() {
  const [topicOrText, setTopicOrText] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!topicOrText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const deck = await generateDeck(topicOrText.trim(), count);
      navigate(`/decks/${deck.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate flashcards. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="daily-card" onSubmit={handleSubmit} style={{ margin: 0 }}>
      <h2 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>Generate a deck</h2>
      <p className="muted" style={{ marginBottom: "1rem" }}>Paste a topic, a paragraph, or your study notes.</p>

      <textarea
        value={topicOrText}
        onChange={(e) => setTopicOrText(e.target.value)}
        placeholder="e.g. Photosynthesis, Ancient Rome, or paste your lecture notes..."
        disabled={loading}
      />

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
        <label className="muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
          Cards:
          <input
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: "75px" }}
            disabled={loading}
          />
        </label>

        <button type="submit" className="primary-btn" style={{ flex: 1 }} disabled={loading || !topicOrText.trim()}>
          {loading ? "Generating..." : "Generate Deck"}
        </button>
      </div>

      {error && (
        <p style={{ color: "var(--accent)", marginTop: "1rem", marginBottom: 0, fontSize: "0.9rem", fontWeight: 600 }}>
          {error}
        </p>
      )}
    </form>
  );
}
