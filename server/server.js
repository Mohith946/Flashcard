import app from "./src/app.js";
import { env } from "./src/config/env.js";

app.listen(env.port, () => {
  console.log(`AI Flashcard Generator API running on http://localhost:${env.port}`);
});
