import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DeckView from "./pages/DeckView";

export default function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks/:id" element={<DeckView />} />
      </Routes>
    </div>
  );
}
