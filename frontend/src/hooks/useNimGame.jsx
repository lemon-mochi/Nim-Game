import { useState } from "react";
import { API, defaultSetup, buildDefaultPiles } from "@/constants/nimConstants";

export function useNimGame() {
  const [screen, setScreen] = useState("setup"); // setup | game | customize
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
  const [buttonMsg, setButtonMsg] = useState("Start Game");
  const [customPiles, setCustomPiles] = useState(buildDefaultPiles(defaultSetup.num_piles));

  const maxAmount = selectedPile !== null && state ? state.piles[selectedPile] : 1;

  async function toggleCustomGameOff() {
    setCustomGame(false);
    setButtonMsg("Start Game");
  }

  async function toggleCustomGameOn() {
    setCustomGame(true);
    setButtonMsg("Continue");
  }

  async function applyAmount() {
    if (selectedPile === null || amount < 1 || amount > 150) return;
    setError("");
    setLoading(true);
    
    setCustomPiles((prev) =>
      prev.map((val, i) => (i === selectedPile ? amount : val))
    );
    setSelectedPile(null);
    setAmount(1);
    setLoading(false);
  }

  async function buttonPress() {
    setError("");
    setLoading(true);
    if (setup.num_piles <= 1) {
      setError("At least two piles required.");
      setLoading(false);
      return;
    }
    if (setup.num_piles > 50) {
      setError("Maximum number of piles should be 50 or fewer.");
      setLoading(false);
      return;
    }    

    if (customGame) {
      setCustomPiles(buildDefaultPiles(setup.num_piles));
      setScreen("customize");
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
    if (setup.max_per_pile > 150) {
      setError("Max per pile should be 150 or fewer.");
      setLoading(false);
      return;
    }

    try {
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

  async function startCustomGame() {
    setError("");
    if (customPiles.some(p => p < 1)) {
      setError("Each pile must have at least 1 stick.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/new-custom-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_piles: setup.num_piles,
          custom_piles: customPiles,
          difficulty: setup.difficulty,
          is_pvp: setup.is_pvp,
          player_goes_first: setup.player_goes_first,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setState(data);
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

  return {
    screen, setScreen, setup, setSetup, state, setState, selectedPile, setSelectedPile,
    amount, setAmount, loading, setLoading, thinking, setThinking, error, setError,
    turnMsg, setTurnMsg, winner, setWinner, customGame, setCustomGame, buttonMsg,
    setButtonMsg, customPiles, setCustomPiles, maxAmount, toggleCustomGameOff,
    toggleCustomGameOn, applyAmount, buttonPress, startCustomGame, makeMove,
    resetToSetup, isPlayerTurn, winMessage
  }

}