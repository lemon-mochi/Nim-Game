import { computerMove } from "../api";

export default function Game({
  piles,
  setPiles,
  mode,
  currentPlayer,
  setCurrentPlayer,
}) {
  async function handleMove(pileIndex, amount) {
    const newPiles = [...piles];
    newPiles[pileIndex] -= amount;
    setPiles(newPiles);

    if (mode === "pvc" && currentPlayer === "human") {
      setCurrentPlayer("computer");
      const move = await computerMove(newPiles);
      const updated = [...newPiles];
      updated[move.pile_index] = move.new_size;
      setPiles(updated);
      setCurrentPlayer("human");
    } else {
      setCurrentPlayer(currentPlayer === "player1" ? "player2" : "player1");
    }
  }

  return (
    <div>
      <h2>Turn: {currentPlayer}</h2>
      {piles.map((pile, i) => (
        <div key={i}>
          Pile {i}: {pile}
          {pile > 0 && (
            <button onClick={() => handleMove(i, 1)}>Remove 1</button>
          )}
        </div>
      ))}
    </div>
  );
}
