# AI Flashcard Generator

Paste in a topic or block of text, get an AI-generated deck of flashcards, then study them with a simple spaced-repetition flow.

Stack: **React (Vite)** frontend + **Node/Express** backend + **OpenAI API** for generation.

## Project layout

```
ai-flashcard-generator/
├── client/     # React frontend
└── server/     # Express backend + OpenAI integration
```

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# add your OPENAI_API_KEY to .env
npm run dev
```

Server runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173` and proxies `/api` requests to the server.

## How it works

1. User submits a topic or pasted text + desired card count via `DeckGenerator`.
2. Frontend calls `POST /api/ai/generate`.
3. Backend (`aiService.js`) builds a prompt (`prompts/flashcardPrompt.js`) and calls the OpenAI API, requesting strict JSON output.
4. The response is parsed into `{ front, back }` pairs, saved as a new Deck (currently **in-memory storage** — see `server/src/models`), and returned to the client.
5. User studies the deck in `FlashCardDeck` / `StudyMode`, flipping cards and marking them known/unknown.

## Current storage

For simplicity, decks/cards are stored **in memory** in `server/src/models/store.js` — data resets when the server restarts. Swap in Postgres/Mongo by replacing that file with real DB calls (the controllers already call it through a small repository-style interface, so the swap is contained to one file).

## Next steps to harden this for production

- Add persistent DB (Postgres + Prisma, or MongoDB + Mongoose)
- Add auth (JWT or a provider like Clerk/Auth0)
- Add real spaced-repetition scheduling (SM-2) instead of the simple known/unknown flags
- Add rate limiting around `/api/ai/generate` (OpenAI calls cost money per request)
- Add streaming generation for large decks
- Add export (Anki `.apkg`, CSV, PDF)
