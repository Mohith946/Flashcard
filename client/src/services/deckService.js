import api from "./api";

export async function generateDeck(topicOrText, count = 10) {
  const { data } = await api.post("/ai/generate", { topicOrText, count });
  return data;
}

export async function listDecks() {
  const { data } = await api.get("/decks");
  return data;
}

export async function getDeck(id) {
  const { data } = await api.get(`/decks/${id}`);
  return data;
}

export async function deleteDeck(id) {
  await api.delete(`/decks/${id}`);
}

export async function markCard(deckId, cardId, known) {
  const { data } = await api.patch(`/decks/${deckId}/cards/${cardId}`, { known });
  return data;
}
