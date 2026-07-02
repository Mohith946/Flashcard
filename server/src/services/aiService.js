import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

/**
 * Generates flashcards from a topic or block of text using the Gemini API.
 * @param {{ topicOrText: string, count: number }} params
 * @returns {Promise<{ title: string, cards: { front: string, back: string }[] }>}
 */
export async function generateFlashcards({ topicOrText, count = 10 }) {
  const systemInstruction = 
    "You are a flashcard-writing assistant. Given source material, produce concise, accurate study flashcards. " +
    "Respond with ONLY valid JSON. " +
    "Fronts should be short questions or terms. Backs should be clear, correct, concise answers (1-3 sentences).";

  const userPrompt = `Create ${count} flashcards from the following topic or text:\n\n${topicOrText}`;

  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: userPrompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          cards: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                front: { type: "STRING" },
                back: { type: "STRING" }
              },
              required: ["front", "back"]
            }
          }
        },
        required: ["title", "cards"]
      }
    }
  });

  const raw = response.text;
  if (!raw) {
    throw new Error("No content returned from Gemini");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON: " + err.message);
  }

  if (!Array.isArray(parsed.cards)) {
    throw new Error("AI response did not include a valid 'cards' array");
  }

  return {
    title: parsed.title || topicOrText.slice(0, 60),
    cards: parsed.cards
      .filter((c) => c && c.front && c.back)
      .map((c) => ({ front: String(c.front), back: String(c.back) })),
  };
}
