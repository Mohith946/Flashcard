import { useState } from "react";

export default function FlashCard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className={`flashcard-container ${flipped ? "flipped" : ""}`} 
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flashcard-inner">
        {/* Front Face (Question) */}
        <div className="flashcard-front">
          <p className="muted" style={{ marginBottom: "0.5rem" }}>
            Question — tap to flip
          </p>
          <p style={{ margin: 0, fontWeight: 500 }}>{card.front}</p>
        </div>

        {/* Back Face (Answer) */}
        <div className="flashcard-back">
          <p className="muted" style={{ marginBottom: "0.5rem" }}>
            Answer — tap to flip
          </p>
          <p style={{ margin: 0, fontWeight: 500 }}>{card.back}</p>
        </div>
      </div>
    </div>
  );
}
