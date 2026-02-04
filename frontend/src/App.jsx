import { useState } from "react";
import Setup from "./components/Setup";
import Game from "./components/Game";

export default function App() {
  const [piles, setPiles] = useState(null);
  const [mode, setMode] = useState("pvp");
  const [currentPlayer, setCurrentPlayer] = useState("human");

  if (!piles) {
    return (
      <Setup
        setPiles={setPiles}
        setMode={setMode}
        setCurrentPlayer={setCurrentPlayer}
      />
    );
  }

  return (
    <Game
      piles={piles}
      setPiles={setPiles}
      mode={mode}
      currentPlayer={currentPlayer}
      setCurrentPlayer={setCurrentPlayer}
    />
  );
}
