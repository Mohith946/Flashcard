import { useState } from "react";

export default function FlashCard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flashcard" onClick={() => setFlipped((f) => !f)}>
      <div>
        <p className="muted" style={{ marginBottom: "0.5rem" }}>
          {flipped ? "Answer" : "Question"} — tap to flip
        </p>
        <p style={{ margin: 0 }}>{flipped ? card.back : card.front}</p>
      </div>
    </div>
  );
}
