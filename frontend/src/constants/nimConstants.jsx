export const API = "http://localhost:8000";

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
};

export function buildDefaultPiles(n) {
    return Array.from({ length: n }, () => defaultSetup.num_piles);
}

export function syncPileCount(newCount) {
    const n = Math.max(2, Math.min(50, Number(newCount) || 2));
    setSetup(s => ({ ...s, num_piles: n }));
    setCustomPiles(prev => {
        if (prev.length < n) return [...prev, ...buildDefaultPiles(n - prev.length)];
        return prev.slice(0, n);
    });
}

export function setPileValue(idx, val) {
    const v = Math.max(1, Math.min(150, Number(val) || 1));
    setCustomPiles(prev => prev.map((p, i) => (i === idx ? v : p)));
}

export function addPile() {
    if (customPiles.length >= 50) return;
    setCustomPiles(prev => [...prev, DEFAULT_PILE_SIZE]);
    setSetup(s => ({ ...s, num_piles: s.num_piles + 1 }));
    }

export function removePile(idx) {
    if (customPiles.length <= 2) return;
    setCustomPiles(prev => prev.filter((_, i) => i !== idx));
    setSetup(s => ({ ...s, num_piles: s.num_piles - 1 }));
    }