export const API = import.meta.env.VITE_API_URL;

export const DIFFICULTIES = [
    { label: "Easy", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Hard", value: 3 },
    { label: "Very Hard", value: 4 },
    { label: "Impossible", value: 5 },
];

export const defaultSetup = {
    is_pvp: false,
    player_goes_first: true,
    num_piles: 3,
    min_per_pile: 3,
    max_per_pile: 10,
    difficulty: 2,
    random_game: true,
    x: 5, // for first pile in wythoff's game
    y: 5 // for second pile in wythoff's game
};

export function buildDefaultPiles(n) {
    return Array.from({ length: n }, () => defaultSetup.num_piles);
}

export const maxCustomAmount = 150;