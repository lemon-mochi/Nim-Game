import { useState, useEffect, useRef } from "react";
import PileCard from "@/components/PileCard/PileCard";
import './styles/globals.scss'

const API = "http://localhost:8000";

const DIFFICULTIES = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 2 },
  { label: "Hard", value: 3 },
  { label: "Very Hard", value: 4 },
  { label: "Impossible", value: 5 },
];

const palette = {
  bg: "#0d0d0d",
  surface: "#161616",
  border: "#2a2a2a",
  accent: "#c8f044",
  accentDim: "#8aad1e",
  text: "#f0f0e8",
  muted: "#555",
  danger: "#ff4d4d",
  playerA: "#c8f044",
  playerB: "#44c8f0",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${palette.bg};
    color: ${palette.text};
    font-family: 'Space Mono', monospace;
    min-height: 100vh;
  }

  .nim-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 60px;
    background:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(200,240,68,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(68,200,240,0.05) 0%, transparent 60%),
      ${palette.bg};
  }

  .title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(56px, 12vw, 96px);
    letter-spacing: 0.12em;
    color: ${palette.text};
    line-height: 1;
    text-align: center;
    margin-bottom: 4px;
  }
  .title span { color: ${palette.accent}; }

  .subtitle {
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: ${palette.muted};
    text-align: center;
    margin-bottom: 48px;
  }

  /* SETUP CARD */
  .setup-card {
    background: ${palette.surface};
    border: 1px solid ${palette.border};
    border-radius: 4px;
    padding: 36px;
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .setup-section-title {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: ${palette.muted};
    margin-bottom: 10px;
  }

  .toggle-group {
    display: flex;
    gap: 0;
    border: 1px solid ${palette.border};
    border-radius: 2px;
    overflow: hidden;
  }
  .toggle-btn {
    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    color: ${palette.muted};
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.05em;
  }
  .toggle-btn.active {
    background: ${palette.accent};
    color: #000;
    font-weight: 700;
  }
  .toggle-btn:not(.active):hover { background: rgba(255,255,255,0.04); color: ${palette.text}; }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .field label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${palette.muted};
  }
  .field input[type=number], .field select {
    background: ${palette.bg};
    border: 1px solid ${palette.border};
    border-radius: 2px;
    color: ${palette.text};
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    padding: 8px 10px;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    -moz-appearance: textfield;
  }
  .field input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  .field input:focus, .field select:focus { border-color: ${palette.accent}; }
  .field select option { background: #1a1a1a; }

  .start-btn {
    width: 100%;
    padding: 14px;
    background: ${palette.accent};
    color: #000;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.2em;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .start-btn:hover { background: #d8ff50; transform: translateY(-1px); }
  .start-btn:active { transform: translateY(0); }

  /* GAME AREA */
  .game-area {
    width: 100%;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${palette.surface};
    border: 1px solid ${palette.border};
    border-radius: 4px;
    padding: 14px 20px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    letter-spacing: 0.08em;
  }
  .status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: ${palette.accent};
    animation: pulse 1.5s infinite;
  }
  .status-dot.idle { background: ${palette.muted}; animation: none; }
  .status-dot.enemy { background: ${palette.playerB}; }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .nim-sum-badge {
    font-size: 11px;
    letter-spacing: 0.1em;
    color: ${palette.muted};
    background: ${palette.bg};
    border: 1px solid ${palette.border};
    border-radius: 2px;
    padding: 4px 10px;
  }
  .nim-sum-badge span {
    color: ${palette.text};
    font-weight: 700;
    margin-left: 6px;
  }
  .reset-btn {
    background: transparent;
    border: 1px solid ${palette.border};
    color: ${palette.muted};
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 6px 14px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .reset-btn:hover { border-color: ${palette.danger}; color: ${palette.danger}; }

  .piles-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  /* MOVE PANEL */
  .move-panel {
    background: ${palette.surface};
    border: 1px solid ${palette.accent};
    border-radius: 4px;
    padding: 24px 28px;
    box-shadow: 0 0 30px rgba(200,240,68,0.08);
  }
  .move-panel-title {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: ${palette.accent};
    margin-bottom: 16px;
  }
  .move-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .move-label {
    font-size: 12px;
    color: ${palette.muted};
    white-space: nowrap;
  }
  .move-amount-controls {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid ${palette.border};
    border-radius: 2px;
    overflow: hidden;
  }
  .amt-btn {
    width: 36px; height: 36px;
    background: ${palette.bg};
    border: none;
    color: ${palette.text};
    font-size: 18px;
    cursor: pointer;
    transition: background 0.1s;
    font-family: 'Space Mono', monospace;
  }
  .amt-btn:hover { background: rgba(255,255,255,0.07); }
  .amt-btn:disabled { opacity: 0.3; cursor: default; }
  .amt-display {
    width: 48px;
    text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: ${palette.accent};
    background: ${palette.bg};
    border-left: 1px solid ${palette.border};
    border-right: 1px solid ${palette.border};
    line-height: 36px;
  }
  .confirm-btn {
    padding: 9px 28px;
    background: ${palette.accent};
    color: #000;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.15em;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
    margin-left: auto;
  }
  .confirm-btn:hover:not(:disabled) { background: #d8ff50; }
  .confirm-btn:disabled { opacity: 0.35; cursor: default; }

  /* GAME OVER */
  .gameover-overlay {
    background: ${palette.surface};
    border: 1px solid ${palette.border};
    border-radius: 4px;
    padding: 48px 36px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .gameover-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 72px;
    letter-spacing: 0.1em;
    line-height: 1;
  }
  .gameover-title.win { color: ${palette.accent}; }
  .gameover-title.lose { color: ${palette.danger}; }
  .gameover-subtitle {
    font-size: 12px;
    letter-spacing: 0.2em;
    color: ${palette.muted};
    text-transform: uppercase;
  }
  .play-again-btn {
    margin-top: 8px;
    padding: 12px 36px;
    background: transparent;
    border: 1px solid ${palette.accent};
    color: ${palette.accent};
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.2em;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .play-again-btn:hover { background: ${palette.accent}; color: #000; }

  /* THINKING */
  .thinking {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: ${palette.playerB};
    text-transform: uppercase;
  }
  .thinking-dots span {
    animation: blink 1.2s infinite;
    font-size: 16px;
  }
  .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
  .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }

  .error-msg {
    font-size: 11px;
    color: ${palette.danger};
    letter-spacing: 0.08em;
    padding: 8px 12px;
    border: 1px solid rgba(255,77,77,0.3);
    border-radius: 2px;
    background: rgba(255,77,77,0.05);
  }
`;

const defaultSetup = {
  is_pvp: false,
  player_goes_first: true,
  num_piles: 3,
  min_per_pile: 3,
  max_per_pile: 10,
  difficulty: 2,
};

export default function NimGame() {
  const [screen, setScreen] = useState("setup"); // setup | game
  const [setup, setSetup] = useState(defaultSetup);
  const [state, setState] = useState(null);
  const [selectedPile, setSelectedPile] = useState(null);
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [turnMsg, setTurnMsg] = useState("");

  const maxAmount = selectedPile !== null && state ? state.piles[selectedPile] : 1;

  async function startGame() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/new-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...setup,
          num_piles: Number(setup.num_piles),
          min_per_pile: Number(setup.min_per_pile),
          max_per_pile: Number(setup.max_per_pile),
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setState(data);
      setSelectedPile(null);
      setAmount(1);
      setTurnMsg(setup.player_goes_first ? "Your turn" : "Computer's turn — waiting...");
      setScreen("game");
      // If computer goes first in PvC
      if (!setup.is_pvp && !setup.player_goes_first) {
        setThinking(true);
        setTimeout(async () => {
          const s = await fetchState();
          setThinking(false);
          setState(s);
          setTurnMsg("Your turn");
        }, 800);
      }
    } catch (e) {
      setError("Could not connect to server. Is it running on localhost:8000?");
    } finally {
      setLoading(false);
    }
  }

  async function fetchState() {
    const res = await fetch(`${API}/state`);
    return await res.json();
  }

  async function makeMove() {
    if (selectedPile === null || amount < 1) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pile_idx: selectedPile, to_subtract: amount }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Invalid move");
      }
      const data = await res.json();
      setSelectedPile(null);
      setAmount(1);

      if (data.game_over) {
        setState(data);
        setTurnMsg("Game over");
        return;
      }

      if (!setup.is_pvp) {
        setThinking(true);
        setState(data);
        setTurnMsg("Computer is thinking...");
        // Small delay to show thinking state (computer already moved in API)
        setTimeout(() => {
          setThinking(false);
          setState(data); // already has computer move applied
          setTurnMsg("Your turn");
        }, 900);
      } else {
        setState(data);
        setTurnMsg(prev => prev === "Player 1's turn" && prev !== "" ? "Player 2's turn" : "Player 1's turn");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function resetToSetup() {
    setScreen("setup");
    setState(null);
    setSelectedPile(null);
    setAmount(1);
    setTurnMsg("");
    setError("");
  }

  const isPlayerTurn = !thinking && !loading && state && !state.game_over;
  const isPvp = setup.is_pvp;

  // Determine game over winner message
  function winMessage() {
    if (!state?.game_over) return null;
    // In Nim, last to take loses (misère) OR last to take wins depending on rules.
    // We don't know the exact variant — display generic game over.
    return "GAME OVER";
  }

  return (
    <>
      <style>{css}</style>
      <div className="nim-root">
        <div className="title">N<span>I</span>M</div>
        <div className="subtitle">The Ancient Game of Strategy</div>

        {screen === "setup" && (
          <div className="setup-card">
            {error && <div className="error-msg">{error}</div>}

            <div>
              <div className="setup-section-title">Game Mode</div>
              <div className="toggle-group">
                <button
                  className={`toggle-btn${!setup.is_pvp ? " active" : ""}`}
                  onClick={() => setSetup(s => ({ ...s, is_pvp: false }))}
                >vs Computer</button>
                <button
                  className={`toggle-btn${setup.is_pvp ? " active" : ""}`}
                  onClick={() => setSetup(s => ({ ...s, is_pvp: true }))}
                >vs Player</button>
              </div>
            </div>

            {!setup.is_pvp && (
              <>
                <div>
                  <div className="setup-section-title">Who Goes First</div>
                  <div className="toggle-group">
                    <button
                      className={`toggle-btn${setup.player_goes_first ? " active" : ""}`}
                      onClick={() => setSetup(s => ({ ...s, player_goes_first: true }))}
                    >Player First</button>
                    <button
                      className={`toggle-btn${!setup.player_goes_first ? " active" : ""}`}
                      onClick={() => setSetup(s => ({ ...s, player_goes_first: false }))}
                    >Computer First</button>
                  </div>
                </div>

                <div>
                  <div className="setup-section-title">Difficulty</div>
                  <div className="toggle-group">
                    {DIFFICULTIES.map(d => (
                      <button
                        key={d.value}
                        className={`toggle-btn${setup.difficulty === d.value ? " active" : ""}`}
                        onClick={() => setSetup(s => ({ ...s, difficulty: d.value }))}
                      >{d.label}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="setup-section-title">Board Configuration</div>
              <div className="field-row">
                <div className="field">
                  <label>Number of Piles</label>
                  <input type="number" min={1} max={6} value={setup.num_piles}
                    onChange={e => setSetup(s => ({ ...s, num_piles: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Min per Pile</label>
                  <input type="number" min={1} max={20} value={setup.min_per_pile}
                    onChange={e => setSetup(s => ({ ...s, min_per_pile: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Max per Pile</label>
                  <input type="number" min={1} max={30} value={setup.max_per_pile}
                    onChange={e => setSetup(s => ({ ...s, max_per_pile: e.target.value }))} />
                </div>
              </div>
            </div>

            <button className="start-btn" onClick={startGame} disabled={loading}>
              {loading ? "Starting..." : "Start Game"}
            </button>
          </div>
        )}

        {screen === "game" && state && (
          <div className="game-area">
            {/* Status bar */}
            <div className="status-bar">
              <div className="status-indicator">
                <div className={`status-dot${state.game_over ? " idle" : thinking ? " enemy" : ""}`} />
                <span style={{ fontSize: 12 }}>
                  {state.game_over ? "Game Over" : thinking ? (
                    <span className="thinking">
                      Computer thinking
                      <span className="thinking-dots">
                        <span>.</span><span>.</span><span>.</span>
                      </span>
                    </span>
                  ) : turnMsg}
                </span>
              </div>
              <button className="reset-btn" onClick={resetToSetup}>↩ New Game</button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {/* Piles */}
            {!state.game_over ? (
              <>
                <div className="piles-container">
                  {state.piles?.map((count, idx) => (
                    <PileCard
                      key={idx}
                      idx={idx}
                      count={count}
                      selected={selectedPile === idx}
                      onSelect={(i) => {
                        if (!isPlayerTurn) return;
                        setSelectedPile(i);
                        setAmount(1);
                      }}
                      disabled={!isPlayerTurn}
                    />
                  ))}
                </div>

                {selectedPile !== null && isPlayerTurn && (
                  <div className="move-panel">
                    <div className="move-panel-title">
                      Remove from Pile {selectedPile + 1}
                    </div>
                    <div className="move-row">
                      <span className="move-label">Amount:</span>
                      <div className="move-amount-controls">
                        <button className="amt-btn"
                          disabled={amount <= 1}
                          onClick={() => setAmount(a => Math.max(1, a - 1))}>−</button>
                        <div className="amt-display">{amount}</div>
                        <button className="amt-btn"
                          disabled={amount >= maxAmount}
                          onClick={() => setAmount(a => Math.min(maxAmount, a + 1))}>+</button>
                      </div>
                      <span style={{ fontSize: 11, color: palette.muted }}>
                        max: {maxAmount}
                      </span>
                      <button
                        className="confirm-btn"
                        onClick={makeMove}
                        disabled={loading || amount < 1 || amount > maxAmount}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="piles-container">
                  {state.piles?.map((count, idx) => (
                    <PileCard key={idx} idx={idx} count={count} selected={false} disabled={true} />
                  ))}
                </div>
                <div className="gameover-overlay">
                  <div className="gameover-title win">GAME OVER</div>
                  <div className="gameover-subtitle">All sticks have been taken</div>
                  <button className="play-again-btn" onClick={resetToSetup}>Play Again</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
