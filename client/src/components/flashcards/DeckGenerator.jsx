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
    <form className="card-panel" onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0 }}>Generate a deck</h2>
      <p className="muted">Paste a topic, a paragraph, or your notes.</p>

      <textarea
        value={topicOrText}
        onChange={(e) => setTopicOrText(e.target.value)}
        placeholder="e.g. The French Revolution, or paste your lecture notes..."
        disabled={loading}
      />

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
        <label className="muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Cards:
          <input
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: "70px" }}
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading || !topicOrText.trim()}>
          {loading ? "Generating..." : "Generate flashcards"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#f87171", marginBottom: 0 }}>{error}</p>
      )}
    </form>
  );
}
