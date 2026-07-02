import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

if (!env.geminiApiKey) {
  console.warn(
    "[warning] GEMINI_API_KEY is not set. AI generation requests will fail until you add it to server/.env"
  );
}
