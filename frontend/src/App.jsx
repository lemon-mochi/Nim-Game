import { useState } from "react";
import PileCard from "@/components/PileCard/PileCard";
import './styles/globals.scss'
import "./styles/nim.scss";

const API = "http://localhost:8000";

const DIFFICULTIES = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 2 },
  { label: "Hard", value: 3 },
  { label: "Very Hard", value: 4 },
  { label: "Impossible", value: 5 },
];

const defaultSetup = {
  is_pvp: false,
  player_goes_first: true,
  num_piles: 3,
  min_per_pile: 3,
  max_per_pile: 10,
  difficulty: 2,
  random_game: true,
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
  const [winner, setWinner] = useState("");
  const [customGame, setCustomGame] = useState(false);
  const [buttomMsg, setbuttonMsg] = useState("Start Game");

  const maxAmount = selectedPile !== null && state ? state.piles[selectedPile] : 1;

  async function toggleCustomGame() {
    if (customGame) {
      setCustomGame(false);
      setbuttonMsg("Start Game");
    } else {
      setCustomGame(true);
      setbuttonMsg("Continue");
    }
  }

  async function startGame() {
    setError("");
    setLoading(true);
    if (setup.num_piles <= 1) {
      setError("At least two piles required.");
      setLoading(false);
      return;
    }
    if (setup.min_per_pile < 1 || setup.max_per_pile < 1) {
      setError("Each pile must have at least one stick.");
      setLoading(false);
      return;
    }
    if (setup.min_per_pile >= setup.max_per_pile) {
      setError("Max per pile must be strictly larger than min per pile.");
      setLoading(false);
      return;
    }
    if (setup.num_piles > 50) {
      setError("Maximum number of piles should be 50 or fewer.");
      setLoading(false);
      return;
    }
    if (setup.max_per_pile > 150) {
      setError("Max per pile should be 150 or fewer.");
      setLoading(false);
      return;
    }

    try {
      if (customGame === false) {
        const res = await fetch(`${API}/new-random-game`, {
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

      } else {
        const res = await fetch(`${API}/new-custom-game`, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            ...setup,

          }),
        });
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setState(data);

      }
      setSelectedPile(null);
      setAmount(1);

      if (!setup.is_pvp) {
        setTurnMsg(setup.player_goes_first ? "Your turn" : "Computer's turn — waiting...");
      } else {
        setTurnMsg("Player 1's turn");
      }
      
      setScreen("game");
      // If computer goes first in PvC
      if (!setup.is_pvp && !setup.player_goes_first) {
        // call the backend function
        const res = await fetch(`${API}/computer_move`, {
          method: "POST",
        });
        const data = await res.json();
        setThinking(true);
        setTimeout(async () => {
          setThinking(false);
          setState(data);
          setTurnMsg("Your turn");
        }, 1500);
      }
    } catch (e) {
      setError(`Could not connect to server. ${e}`);
    } finally {
      setLoading(false);
    }
  }

  async function makeMove() {
    if (selectedPile === null || amount < 1) return;
    setError("");
    setLoading(true);
    try {

      // break into cases. Game can either be player v player or player v computer
      if (!setup.is_pvp) {
        // player's turn to make a move
        const res = await fetch(`${API}/human_move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pile_idx: selectedPile, to_subtract: amount }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Invalid move");
        }
        const data = await res.json();
        setState(data);

        if (data.game_over) {
          setState(data);
          setWinner("player");
          setTurnMsg("Game over");
          return;
        }      

        setThinking(true);
        setTurnMsg("Computer is thinking...");  
      
        // computer's turn to make a move
        const res2 = await fetch(`${API}/computer_move`, {
          method: "POST",
        });
        const data2 = await res2.json();
        // Small delay to show thinking state (computer already moved in API)
        setTimeout(() => {
          setThinking(false);
          setState(data2); // already has computer move applied
        }, 1500);

        if (data2.game_over) {
          setState(data2);
          setWinner("computer");
          setTurnMsg("Game over");
          return;
        }

        setTurnMsg("Your turn");

      } else {
        // player vs player
        if (selectedPile === null || amount < 1) return;
        const res = await fetch(`${API}/human_move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pile_idx: selectedPile, to_subtract: amount }),
        });
          
        const data = await res.json();
        setState(data);

        if (data.game_over) {
          setState(data);
          setWinner(turnMsg);
          setTurnMsg("Game over");
          return;
        }
        
        setTurnMsg(prev => prev === "Player 1's turn" ? "Player 2's turn" : "Player 1's turn");
      }

      setSelectedPile(null);
      setAmount(1);
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

  // Determine game over winner message
  function winMessage() {
    if (!state?.game_over) return null;
    
    if (!setup.is_pvp) {
      return winner === "computer" ? "COMPUTER WINS!" : "YOU WIN!";
    } else {
      return winner === "Player 1's turn" ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
    }
  }

  return (
    <>
      <div className="nim-root">
        <div className="title">N<span>I</span>M</div>
        <div className="subtitle">The Ancient Game of Strategy</div>

        {screen === "setup" && (
          <>
            <div className="setup-card">
              <div className="rules-badge">
              Rules of Nim Game: <br></br>
              Two players. Players take turns removing any number of sticks from a single pile (at least one). The last player to make a move is the winner.
              </div>
            </div>
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
                <div className="toggle-group">
                  <button
                    className={`toggle-btn${!customGame ? " active" : ""}`}
                    onClick={() => toggleCustomGame()}
                  >Random Game</button>
                  <button
                    className={`toggle-btn${customGame ? " active" : ""}`}
                    onClick={() => toggleCustomGame()}
                  >Custom Game</button>

                </div>
                {/* the following line adds extra space to make it look cleaner */}
                <div className="setup-section-title"></div>
                <div className="field-row">
                  <div className="field">
                    <label>Number of Piles</label>
                    <input type="number" value={setup.num_piles}
                      onChange={e => setSetup(s => ({ ...s, num_piles: e.target.value }))} />
                  </div>
                  {!customGame && (
                    <>
                      <div className="field">
                        <label>Min per Pile</label>
                        <input type="number" value={setup.min_per_pile}
                          onChange={e => setSetup(s => ({ ...s, min_per_pile: e.target.value }))} />
                      </div>
                      <div className="field">
                        <label>Max per Pile</label>
                        <input type="number" value={setup.max_per_pile}
                          onChange={e => setSetup(s => ({ ...s, max_per_pile: e.target.value }))} />
                      </div>
                    </>
                  )}

                </div>
              </div>

              <button className="start-btn" onClick={startGame} disabled={loading}>
                {loading ? "Starting..." : buttomMsg}
              </button>
            </div>
          </>
        
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
                      <span style={ { fontSize: 11, color: "var(--global-muted)" } }>
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
                  <div className="gameover-title win">{winMessage()}</div>
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
