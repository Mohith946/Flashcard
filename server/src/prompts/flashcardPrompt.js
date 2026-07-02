export function buildFlashcardPrompt({ topicOrText, count }) {
  return [
    {
      role: "system",
      content:
        "You are a flashcard-writing assistant. Given source material, produce concise, accurate study flashcards. " +
        "Respond with ONLY valid JSON, no markdown fences, no commentary. " +
        'The JSON shape must be: { "title": string, "cards": [{ "front": string, "back": string }] }. ' +
        "Fronts should be short questions or terms. Backs should be clear, correct, concise answers (1-3 sentences).",
    },
    {
      role: "user",
      content: `Create ${count} flashcards from the following topic or text:\n\n${topicOrText}`,
    },
  ];
}
