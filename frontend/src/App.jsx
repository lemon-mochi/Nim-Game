import { useEffect, useState } from 'react';
import Pile from '@/components/Pile/Pile';

const API = "http://localhost:8000";

export default function App() {
  const [state, setState] = useState(null);
  const [selectedPile, setSelectedPile] = useState(null);
  const [amount, setAmount] = useState(1);

  // Start new game on load
  useEffect(() => {
    fetch(`${API}/new-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_pvp: false,
        player_goes_first: false,
        num_piles: 10,
        min_per_pile: 5,
        max_per_pile: 20,
        difficulty: 4
      })
    })
      .then(res => res.json())
      .then(setState);
  }, []);

  const submitMove = () => {
    if (selectedPile === null) return;

    fetch(`${API}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pile_idx: selectedPile,
        to_subtract: amount
      })
    })
      .then(res => res.json())
      .then(data => {
        setState(data);
        setSelectedPile(null);
        setAmount(1);
      });
  };

  if (!state) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Nim Game</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {state.piles.map((pile, i) => (
          // <button
          //   key={i}
          //   disabled={pile === 0}
          //   onClick={() => setSelectedPile(i)}
          //   style={{
          //     padding: 10,
          //     background: selectedPile === i ? "#4caf50" : "#eee"
          //   }}
          // >
          //   Pile {i}: {pile}
          // </button>
          <Pile
            key={i}
            originalNumSticks={pile}
            onClick={() => setSelectedPile(i)}
          />
        ))}
      </div>

      {selectedPile !== null && (
        <div>
          <p>Remove from pile {selectedPile}</p>
          <input
            type="number"
            min={1}
            max={state.piles[selectedPile]}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
          />
          <button onClick={submitMove}>Confirm Move</button>
        </div>
      )}

      {state.game_over && <h2>Game Over</h2>}
    </div>
  );
}
