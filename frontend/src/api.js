const API = "http://localhost:8000";

export async function createRandomGame(data) {
  const res = await fetch(`${API}/game/random`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createCustomGame(piles) {
  const res = await fetch(`${API}/game/custom`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ piles }),
  });
  return res.json();
}

export async function computerMove(piles) {
  const res = await fetch(`${API}/move/computer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ piles }),
  });
  return res.json();
}
