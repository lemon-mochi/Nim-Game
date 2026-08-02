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
  const [wythoff, setWythoff] = useState(false);
  const [customGame, setCustomGame] = useState(false);
  const [buttonMsg, setButtonMsg] = useState("Start Game");
  const [customPiles, setCustomPiles] = useState(buildDefaultPiles(defaultSetup.num_piles));

const maxAmount =
  state?.piles && selectedPile !== null
    ? wythoff
      ? selectedPile === 0
        ? state.piles[0]
        : selectedPile === 1
          ? state.piles[1]
          : Math.min(state.piles[0], state.piles[1])
      : state.piles[selectedPile]
    : 1;

  async function toggleCustomGameOff() {
    setCustomGame(false);
    setButtonMsg("Start Game");
  }

  async function toggleCustomGameOn() {
    setCustomGame(true);
    setButtonMsg("Continue");
  }

  async function toggleWythoffGameOff() {
    setWythoff(false);
  }

  async function toggleWythoffGameOn() {
    setWythoff(true);
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

  try {
    // Common validation
    if (setup.min_per_pile < 1 || setup.max_per_pile < 1) {
      setError("Each pile must have at least one stick.");
      return;
    }

    if (setup.min_per_pile >= setup.max_per_pile) {
      setError("Max per pile must be strictly larger than min per pile.");
      return;
    }

    if (setup.max_per_pile > 150) {
      setError("Max per pile should be 150 or fewer.");
      return;
    }

    let newGameEndpoint;
    let computerEndpoint;

    if (!wythoff) {
      // Classical Nim validation
      if (setup.num_piles <= 1) {
        setError("At least two piles required.");
        return;
      }

      if (setup.num_piles > 50) {
        setError("Maximum number of piles should be 50 or fewer.");
        return;
      }

      if (customGame) {
        setCustomPiles(buildDefaultPiles(setup.num_piles));
        setScreen("customize");
        return;
      }

      newGameEndpoint = "/nim/new-random-game";
      computerEndpoint = "/nim/computer-move";

    } else {
      // Wythoff validation
      if (customGame && setup.x === setup.y) {
        setError("The two piles must have a different number of sticks.");
        return;
      }

      newGameEndpoint = customGame
        ? "/wythoffs/new-custom-game"
        : "/wythoffs/new-random-game";

      computerEndpoint = "/wythoffs/computer-move";
    }


    let body;

    if (!wythoff) {
      body = {
        ...setup,
        num_piles: Number(setup.num_piles),
        min_per_pile: Number(setup.min_per_pile),
        max_per_pile: Number(setup.max_per_pile),
      };
    } 
    else if (customGame) {
      body = {
        x: Number(setup.x),
        y: Number(setup.y),
        difficulty: setup.difficulty,
        is_pvp: setup.is_pvp,
        player_goes_first: setup.player_goes_first,
      };
    } 
    else {
      body = {
        is_pvp: setup.is_pvp,
        player_goes_first: setup.player_goes_first,
        min_per_pile: Number(setup.min_per_pile),
        max_per_pile: Number(setup.max_per_pile),
        difficulty: setup.difficulty,
      };
    }


    const res = await fetch(`${API}${newGameEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    let data = await res.json();

    setState(data);
    setSelectedPile(null);
    setAmount(1);

    if (!setup.is_pvp) {
      setTurnMsg(
        setup.player_goes_first
          ? "Your turn"
          : "Computer's turn — waiting..."
      );
    } else {
      setTurnMsg("Player 1's turn");
    }

    setScreen("game");


    // Computer starts
    if (!setup.is_pvp && !setup.player_goes_first) {

      const computerRes = await fetch(
        `${API}${computerEndpoint}`,
        {
          method: "POST",
        }
      );

      const computerData = await computerRes.json();

      setThinking(true);

      setTimeout(() => {
        setThinking(false);
        setState(computerData);
        setTurnMsg("Your turn");
      }, 1500);
    }


  } catch (e) {
    setError(`Could not connect to server. ${e.message}`);
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
      const res = await fetch(`${API}/nim/new-custom-game`, {
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
        const res = await fetch(`${API}/nim/computer-move`, {
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

    const prefix = wythoff ? "/wythoffs" : "/nim";

    try {
      const humanMoveBody = wythoff
        ? {
            move_type: selectedPile + 1,
            to_subtract: amount,
          }
        : {
            pile_idx: selectedPile,
            to_subtract: amount,
          };


      // Player move
      const res = await fetch(`${API}${prefix}/human-move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(humanMoveBody),
      });


      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Invalid move");
      }

      const data = await res.json();
      setState(data);


      if (data.game_over) {
        setWinner("player");
        setTurnMsg("Game over");
        return;
      }


      // Computer move
      if (!setup.is_pvp) {
        setThinking(true);
        setTurnMsg("Computer is thinking...");


        const res2 = await fetch(`${API}${prefix}/computer-move`, {
          method: "POST",
        });


        const data2 = await res2.json();


        setTimeout(() => {
          setThinking(false);
          setState(data2);

          if (data2.game_over) {
            setWinner("computer");
            setTurnMsg("Game over");
          } else {
            setTurnMsg("Your turn");
          }

        }, 1500);


      } else {
        // PvP
        setTurnMsg(prev =>
          prev === "Player 1's turn"
            ? "Player 2's turn"
            : "Player 1's turn"
        );
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
    resetToSetup, isPlayerTurn, winMessage,
    wythoff, toggleWythoffGameOff, toggleWythoffGameOn,
  }

}