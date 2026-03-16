from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nim import Game, Difficulty, np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
)

# ---- GLOBAL STATE ----
game: Game | None = None


class NewRandomGameRequest(BaseModel):
    is_pvp: bool
    player_goes_first: bool
    num_piles: int
    min_per_pile: int
    max_per_pile: int
    difficulty: Difficulty
    random_game: int


class NewCustomGameRequest(BaseModel):
    is_pvp: bool
    player_goes_first: bool
    num_piles: int
    difficulty: Difficulty
    num_per_array: np.ndarray


class MoveRequest(BaseModel):
    pile_idx: int
    to_subtract: int


@app.post("/new-random-game")
def new_random_game(req: NewRandomGameRequest):
    global game
    game = Game(
        is_pvp=req.is_pvp,
        player_goes_first=req.player_goes_first,
        num_piles=req.num_piles,
        min_per_pile=req.min_per_pile,
        max_per_pile=req.max_per_pile,
        random_game=req.random_game,
        diff_level=req.difficulty,
    )
    return get_state()


@app.post("/new_custom-game")
def new_custom_game(req: NewCustomGameRequest):
    global game
    game = Game(
        is_pvp=req.is_pvp,
        player_goes_first=req.player_goes_first,
        num_piles=req.num_piles,
        random_game=False,
        diff_level=req.difficulty,
        num_per_array=req.num_per_array,
    )
    return get_state()


@app.post("/human_move")
def human_move(req: MoveRequest):
    game.play_round(req.pile_idx, req.to_subtract)

    return get_state()


@app.post("/computer_move")
def computer_move():
    game.computer_move()

    return get_state()


@app.get("/state")
def get_state():
    if game is not None:
        return {
            "piles": game.piles.tolist(),
            "nim_sum": int(game.nim_sum),
            "balanced": bool(game.is_balanced_flag),
            "game_over": bool(game.game_over),
        }
    else:
        return {
            "piles": None,
            "nim_sum": None,
            "balanced": None,
            "game_over": None,
        }
