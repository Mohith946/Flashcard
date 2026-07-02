import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeckGenerator from "../components/flashcards/DeckGenerator";
import { listDecks, deleteDeck } from "../services/deckService";

const WORD_OF_THE_DAY = [
  {
    word: "Idioticon",
    type: "n",
    def: "A dictionary of a peculiar dialect, or of the words and phrases peculiar to a particular province or region.",
    source: "Wiktionary"
  },
  {
    word: "Mellifluous",
    type: "adj",
    def: "Sweetly or smoothly flowing; sweet-sounding; pleasant to hear (like honey).",
    source: "Oxford"
  },
  {
    word: "Ephemeral",
    type: "adj",
    def: "Lasting for a very short time; transient; fleeting or passing quickly.",
    source: "Wiktionary"
  },
  {
    word: "Sycophant",
    type: "n",
    def: "A person who acts obsequiously toward someone important in order to gain advantage.",
    source: "Oxford"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0); // 0: Decks, 1: Create, 2: About, 3: Search
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [studyHistory, setStudyHistory] = useState([]);
  const [streakDays, setStreakDays] = useState([
    { label: "M", completed: false },
    { label: "T", completed: false },
    { label: "W", completed: false },
    { label: "T", completed: false },
    { label: "F", completed: false },
    { label: "S", completed: false },
    { label: "S", completed: false }
  ]);

  // Select a word of the day based on the day of the month
  const dayOfMonth = new Date().getDate();
  const dailyWord = WORD_OF_THE_DAY[dayOfMonth % WORD_OF_THE_DAY.length];
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).toUpperCase();

  async function refresh() {
    setLoading(true);
    try {
      setDecks(await listDecks());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();

    // Load streak from localStorage or initialize
    const saved = localStorage.getItem("ai-flashcards-streak");
    const dayOfWeek = (new Date().getDay() + 6) % 7; // 0: M, 1: T ... 6: S

    let currentStreak;
    if (saved) {
      try {
        currentStreak = JSON.parse(saved);
      } catch (e) {
        currentStreak = null;
      }
    }

    if (!currentStreak || !Array.isArray(currentStreak) || currentStreak.length !== 7) {
      currentStreak = [
        { label: "M", completed: false },
        { label: "T", completed: false },
        { label: "W", completed: false },
        { label: "T", completed: true }, // default dummy active days
        { label: "F", completed: true },
        { label: "S", completed: false },
        { label: "S", completed: false }
      ];
    }

    // Mark today as completed automatically since they opened the app
    currentStreak[dayOfWeek].completed = true;
    setStreakDays(currentStreak);
    localStorage.setItem("ai-flashcards-streak", JSON.stringify(currentStreak));

    // Load and save study history
    const savedHistory = localStorage.getItem("ai-flashcards-study-history");
    let historyList = [];
    const todayStr = new Date().toISOString().split('T')[0];

    if (savedHistory) {
      try {
        historyList = JSON.parse(savedHistory);
      } catch (e) {
        historyList = [];
      }
    } else {
      // First load: pre-populate some dates for demo
      const d1 = new Date();
      d1.setDate(d1.getDate() - 1);
      const d2 = new Date();
      d2.setDate(d2.getDate() - 2);
      const d5 = new Date();
      d5.setDate(d5.getDate() - 5);

      historyList = [
        todayStr,
        d1.toISOString().split('T')[0],
        d2.toISOString().split('T')[0],
        d5.toISOString().split('T')[0]
      ];
    }

    if (!historyList.includes(todayStr)) {
      historyList.push(todayStr);
    }
    setStudyHistory(historyList);
    localStorage.setItem("ai-flashcards-study-history", JSON.stringify(historyList));
  }, []);

  async function handleDelete(id, e) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this deck?")) {
      await deleteDeck(id);
      refresh();
    }
  }

  function handleSpeak(e) {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(dailyWord.word);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Filtered decks for Search Tab
  const filteredDecks = decks.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.1" }}>
          <span className="serif-text" style={{ fontWeight: 850, fontSize: "1.2rem", letterSpacing: "0.5px", color: "var(--text)" }}>
            FLASHLEARN
          </span>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "1px" }}>
            SINCE 2026
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav desktop-only">
          <button className={activeTab === 0 ? "active" : ""} onClick={() => setActiveTab(0)}>Decks</button>
          <button className={activeTab === 1 ? "active" : ""} onClick={() => setActiveTab(1)}>Generate</button>
          <button className={activeTab === 3 ? "active" : ""} onClick={() => setActiveTab(3)}>Search</button>
          <button className={activeTab === 2 ? "active" : ""} onClick={() => setActiveTab(2)}>About</button>
        </nav>

        <div className="logo-container">
          <svg viewBox="0 0 100 100" width="36" height="36" style={{ display: "block" }}>
            {/* Bulb Glow */}
            <path d="M50 22 C37 22, 28 32, 28 47 C28 58, 34 65, 39 71 C42 75, 42 78, 43 81 L57 81 C58 78, 58 75, 61 71 C66 65, 72 58, 72 47 C72 32, 63 22, 50 22 Z" fill="#ffd54f" />
            <path d="M50 25 C40 25, 31 33, 31 47 C31 56, 36 62, 41 68 C44 72, 45 74, 45 77 L55 77 C55 74, 56 72, 59 68 C64 62, 69 56, 69 47 C69 33, 60 25, 50 25 Z" fill="#ffca28" />

            {/* Screw base */}
            <path d="M43 81 H57 V83 C57 84, 56 85, 55 85 H45 C44 85, 43 84, 43 83 Z" fill="#b0bec5" />
            <path d="M44 85 H56 V87 C56 88, 55 89, 54 89 H46 C45 89, 44 88, 44 87 Z" fill="#90a4ae" />
            <path d="M46 89 H54 C55 89, 55 91, 54 92 C53 93, 47 93, 46 92 C45 91, 45 89, 46 89 Z" fill="#78909c" />

            {/* Cap Underneath Support */}
            <path d="M36 43 L36 48 C36 54, 64 54, 64 48 L64 43 Z" fill="#0d47a1" />

            {/* Mortarboard Diamond Top */}
            <polygon points="10,34 50,14 90,34 50,54" fill="#0d47a1" />
            <polygon points="15,34 50,17 85,34 50,51" fill="none" stroke="#00b0ff" strokeWidth="2" />

            {/* Tassel */}
            <circle cx="50" cy="34" r="2.5" fill="#0a388e" />
            <path d="M50 34 C58 34, 66 38, 66 46 L66 54" fill="none" stroke="#0a388e" strokeWidth="2" strokeLinecap="round" />
            <rect x="64" y="54" width="4" height="8" rx="1" fill="#0a388e" />
          </svg>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="phone-content">
        {/* Tab 0: Home / Dashboard */}
        {activeTab === 0 && (
          <div className="dashboard-grid">
            {/* Left Column: Daily Card + Streak */}
            <div>
              {/* Search Pill */}
              <div className="search-pill-container mobile-only" onClick={() => setActiveTab(3)}>
                <div className="search-pill">
                  <input type="text" placeholder="ENTER A TOPIC..." readOnly />
                </div>
              </div>

              {/* Daily Card */}
              <div className="daily-card">
                <div className="daily-card-header">
                  <div className="daily-card-date">{formattedDate}</div>
                  <button className="sound-button" onClick={handleSpeak} title="Listen">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  </button>
                </div>
                <h3 className="daily-card-title">{dailyWord.word}</h3>
                <p className="daily-card-body">
                  <span style={{ fontStyle: "italic", fontWeight: 600 }}>{dailyWord.type}</span> {dailyWord.def}
                  <br />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "inline-block" }}>— {dailyWord.source}</span>
                </p>

                {/* Bird Illustration */}
                <div className="daily-card-illustration">
                  <svg viewBox="0 0 100 100" width="90" height="90">
                    <path d="M20 70 C30 50, 50 40, 75 40 C70 50, 70 65, 55 75 C40 85, 25 80, 20 70 Z" fill="#787a60" />
                    <path d="M35 77 C45 83, 60 75, 65 65 C68 58, 68 50, 75 40 C65 42, 50 50, 40 62 C35 68, 32 73, 35 77 Z" fill="#dfbe6b" />
                    <path d="M50 45 C65 45, 75 58, 70 75 C60 70, 55 60, 50 45 Z" fill="#585a40" />
                    <path d="M75 40 C80 38, 85 42, 85 45 C80 46, 76 43, 75 40 Z" fill="#2d2f1d" />
                    <polygon points="85,42 93,45 84,48" fill="#e89e3a" />
                    <circle cx="78" cy="43" r="1.5" fill="black" />
                    <circle cx="78.5" cy="42.5" r="0.5" fill="white" />
                    <path d="M20 70 C10 68, 5 72, 2 76 C5 78, 12 76, 20 70 Z" fill="#585a40" />
                    <path d="M5 88 C30 86, 70 88, 95 85" stroke="#484a32" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Study Streak */}
              <div className="section-header">
                <h2>Study Streak</h2>
                <button
                  onClick={() => setShowCalendarModal(true)}
                  className="delete-btn"
                  style={{ padding: "0.25rem", display: "flex", alignItems: "center" }}
                  title="View Study History"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                  </svg>
                </button>
              </div>
              <div className="streak-container" style={{ marginBottom: 0 }}>
                {streakDays.map((day, i) => (
                  <div key={i} className="streak-day">
                    <div className="streak-label">{day.label}</div>
                    <div className={`streak-circle ${day.completed ? "completed" : ""}`}>
                      {day.completed ? "✓" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Word Decks */}
            <div>
              <div className="section-header" style={{ marginTop: 0 }}>
                <h2>Word Decks</h2>
              </div>
              {loading && <p className="muted" style={{ textAlign: "center" }}>Loading...</p>}
              {!loading && decks.length === 0 && (
                <p className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>
                  No decks yet. Use the Create tab to generate one!
                </p>
              )}

              {decks.map((deck) => (
                <div className="deck-card" key={deck.id}>
                  <div className="deck-info">
                    <Link to={`/decks/${deck.id}`} className="deck-title">
                      {deck.title}
                    </Link>
                    <span className="muted">{deck.cardCount} cards in this deck</span>
                  </div>
                  <div className="deck-right">
                    <div className="deck-indicator">
                      <div className="chart-bars">
                        <div className="chart-bar filled" style={{ height: "8px" }} />
                        <div className={`chart-bar ${deck.cardCount > 4 ? "filled" : ""}`} style={{ height: "12px" }} />
                        <div className={`chart-bar ${deck.cardCount > 8 ? "filled" : ""}`} style={{ height: "16px" }} />
                        <div className={`chart-bar active`} style={{ height: "10px" }} />
                      </div>
                      <div className="indicator-text">{String(deck.cardCount * 25).padStart(4, "0")}</div>
                    </div>
                    <button className="delete-btn" onClick={(e) => handleDelete(deck.id, e)} title="Delete Deck">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Create a Deck */}
        {activeTab === 1 && (
          <div style={{ marginTop: "1rem" }}>
            <DeckGenerator onGenerated={refresh} />
          </div>
        )}

        {/* Tab 2: About / Glossary */}
        {activeTab === 2 && (
          <div style={{ padding: "0.5rem 0" }}>
            <h2 style={{ marginBottom: "1rem" }}>About Flashcard AI</h2>
            <p className="muted" style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
              This application is a premium AI-powered flashcard builder that leverages the <strong>Google Gemini API</strong> to automatically convert any study materials, concepts, or web documents into active-recall study decks.
            </p>
            <p className="muted" style={{ lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Our design draws inspiration from warm, minimalist paper aesthetics, ensuring high readability and a calming study environment.
            </p>

            <h3>Tech Stack</h3>
            <ul className="muted" style={{ paddingLeft: "1.25rem", margin: "0.75rem 0 2rem", lineHeight: "1.8" }}>
              <li><strong>Frontend:</strong> React, Vite, Vanilla CSS</li>
              <li><strong>Backend:</strong> Node.js, Express</li>
              <li><strong>AI Service:</strong> Google Gemini SDK (gemini-2.5-flash)</li>
              <li><strong>Styling:</strong> Curated Warm Paper Palette & Lora Typography</li>
            </ul>

            <footer className="info-footer muted">
              &copy; 2026 Mohith. All rights reserved.
            </footer>
          </div>
        )}

        {/* Tab 3: Search Tab */}
        {activeTab === 3 && (
          <div style={{ marginTop: "0.5rem" }}>
            <div className="search-pill">
              <input
                type="text"
                placeholder="SEARCH DECKS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className="search-pill-icon" onClick={() => setSearchQuery("")}>
                Clear
              </button>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              {filteredDecks.length === 0 ? (
                <p className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>
                  No matching decks found.
                </p>
              ) : (
                filteredDecks.map((deck) => (
                  <div className="deck-card" key={deck.id}>
                    <div className="deck-info">
                      <Link to={`/decks/${deck.id}`} className="deck-title">
                        {deck.title}
                      </Link>
                      <span className="muted">{deck.cardCount} cards</span>
                    </div>
                    <div className="deck-right">
                      <button className="delete-btn" onClick={(e) => handleDelete(deck.id, e)}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Tab Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 0 ? "active" : ""}`}
          onClick={() => setActiveTab(0)}
          title="Dashboard"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M3 3h8v8H3zm0 10h8v8H3zM13 3h8v8h-8zm0 10h8v8h-8z" />
          </svg>
        </button>

        <button
          className={`nav-item ${activeTab === 1 ? "active" : ""}`}
          onClick={() => setActiveTab(1)}
          title="Generate Deck"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M2 4h16v2H2zm2 4h16v2H4zm2 4h16v2H6zm2 4h16v2H8zm2 4h16v2H10z" />
          </svg>
          <span className="nav-badge">+</span>
        </button>

        <button
          className={`nav-item ${activeTab === 2 ? "active" : ""}`}
          onClick={() => setActiveTab(2)}
          title="About Info"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        </button>

        <button
          className={`nav-item ${activeTab === 3 ? "active" : ""}`}
          onClick={() => {
            setActiveTab(3);
            setSearchQuery("");
          }}
          title="Search"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>
      </nav>

      {/* Calendar History Modal */}
      {showCalendarModal && (() => {
        const todayDate = new Date();
        const currentYear = todayDate.getFullYear();
        const currentMonth = todayDate.getMonth();
        const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0: Sun, 1: Mon...
        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthName = todayDate.toLocaleString("default", { month: "long" });

        const calendarDays = [];
        // Add empty slots for days before the 1st
        for (let i = 0; i < firstDayOfWeek; i++) {
          calendarDays.push({ day: null, dateStr: null });
        }
        // Add actual days
        for (let d = 1; d <= totalDaysInMonth; d++) {
          const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          calendarDays.push({ day: d, dateStr: dStr });
        }

        return (
          <div className="modal-overlay" onClick={() => setShowCalendarModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.2rem" }}>Study History</h3>
                <button className="delete-btn" onClick={() => setShowCalendarModal(false)} style={{ fontSize: "1.25rem", lineHeight: 1 }}>
                  &times;
                </button>
              </div>

              <div style={{ textAlign: "center", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem" }} className="serif-text">
                {monthName} {currentYear}
              </div>

              <div className="calendar-grid">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="calendar-header-day">{d}</div>
                ))}
                {calendarDays.map((cell, idx) => {
                  if (!cell.day) {
                    return <div key={idx} className="calendar-day-cell empty" />;
                  }
                  const isStudied = studyHistory.includes(cell.dateStr);
                  const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
                  return (
                    <div
                      key={idx}
                      className={`calendar-day-cell ${isStudied ? "studied" : ""} ${isToday ? "today" : ""}`}
                    >
                      {cell.day}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }} className="muted">
                <span>Total studied: <strong>{studyHistory.length} days</strong></span>
                <span>This month: <strong>{studyHistory.filter(d => {
                  const day = new Date(d);
                  return day.getMonth() === currentMonth;
                }).length} active</strong></span>
              </div>

              <button
                className="primary-btn"
                style={{ width: "100%", marginTop: "1.25rem" }}
                onClick={() => setShowCalendarModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );
}
