import { useState } from "react";
import { createRandomGame, createCustomGame } from "../api";

export default function Setup({ setPiles, setMode, setCurrentPlayer }) {
  const [numPiles, setNumPiles] = useState(3);
  const [minSticks, setMinSticks] = useState(1);
  const [maxSticks, setMaxSticks] = useState(7);
  const [custom, setCustom] = useState("");
  const [mode, localSetMode] = useState("pvp");
  const [first, setFirst] = useState("human");

  async function startRandom() {
    const res = await createRandomGame({
      num_piles: numPiles,
      min_sticks: minSticks,
      max_sticks: maxSticks,
      computer_first: mode === "pvc" && first === "computer",
    });

    setMode(mode);
    setCurrentPlayer(first);
    setPiles(res.piles);
  }

  async function startCustom() {
    const piles = custom.split(",").map(Number);
    const res = await createCustomGame(piles);
    setMode(mode);
    setCurrentPlayer(first);
    setPiles(res.piles);
  }

  return (
    <div>
      <h2>Setup</h2>

      <select value={mode} onChange={e => localSetMode(e.target.value)}>
        <option value="pvp">Person vs Person</option>
        <option value="pvc">Person vs Computer</option>
      </select>

      {mode === "pvc" && (
        <select value={first} onChange={e => setFirst(e.target.value)}>
          <option value="human">Human first</option>
          <option value="computer">Computer first</option>
        </select>
      )}

      <h3>Random Game</h3>
      <button onClick={startRandom}>Start</button>

      <h3>Custom Game</h3>
      <input
        value={custom}
        onChange={e => setCustom(e.target.value)}
        placeholder="3,4,5"
      />
      <button onClick={startCustom}>Start</button>
    </div>
  );
}
