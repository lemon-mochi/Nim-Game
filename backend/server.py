from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nim import Game, Difficulty

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
last_player: str | None = None


class NewGameRequest(BaseModel):
    is_pvp: bool
    player_goes_first: bool
    num_piles: int
    min_per_pile: int
    max_per_pile: int
    difficulty: Difficulty


class MoveRequest(BaseModel):
    pile_idx: int
    to_subtract: int


@app.post("/new-game")
def new_game(req: NewGameRequest):
    global game
    global last_player
    if not req.is_pvp:
        last_player = "computer" if req.player_goes_first else "player"
    else:
        last_player = "player 2"
    game = Game(
        is_pvp=req.is_pvp,
        player_goes_first=req.player_goes_first,
        num_piles=req.num_piles,
        min_per_pile=req.min_per_pile,
        max_per_pile=req.max_per_pile,
        random_game=True,
        diff_level=req.difficulty,
    )
    return get_state()


@app.post("/move")
def move(req: MoveRequest):
    game.play_round(req.pile_idx, req.to_subtract)

    # if game.is_pvp:
    #     # last_player = "player 2" if last_player == "player 1" else "player 2"
    # else:
    #     # last_player = "computer"

    if not game.is_pvp and not game.game_over:
        game.computer_move()
        # last_player = "player"
    return get_state()


@app.get("/state")
def get_state():
    if game is not None:
        return {
            "piles": game.piles.tolist(),
            "nim_sum": int(game.nim_sum),
            "balanced": bool(game.is_balanced_flag),
            "game_over": bool(game.game_over),
            "last_player": last_player,
        }
    else:
        return {
            "piles": None,
            "nim_sum": None,
            "balanced": None,
            "game_over": None,
            "last_player": None,
        }
