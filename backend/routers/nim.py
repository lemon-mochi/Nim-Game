from fastapi import APIRouter

from games.nim import Game
from models.nim import (
    NewRandomGameRequest,
    NewCustomGameRequest,
    MoveRequest,
)
import state

router = APIRouter(prefix="/nim", tags=["Nim"])


@router.post("/new-random-game")
def new_random_game(req: NewRandomGameRequest):

    state.game = Game(
        is_pvp=req.is_pvp,
        player_goes_first=req.player_goes_first,
        num_piles=req.num_piles,
        min_per_pile=req.min_per_pile,
        max_per_pile=req.max_per_pile,
        random_game=True,
        diff_level=req.difficulty,
    )

    return state.game.state()


@router.post("/new-custom-game")
def new_custom_game(req: NewCustomGameRequest):
    if len(req.custom_piles) != req.num_piles:
        raise ValueError("num_piles must match length of custom_piles")
    global game
    state.game = Game(
        is_pvp=req.is_pvp,
        player_goes_first=req.player_goes_first,
        num_piles=req.num_piles,
        random_game=False,
        diff_level=req.difficulty,
        num_per_array=req.custom_piles,
    )
    return state.game.state()


@router.post("/human-move")
def human_move(req: MoveRequest):

    state.game.play_round(req.pile_idx, req.to_subtract)

    return state.game.state()


@router.post("/computer-move")
def computer_move():

    state.game.computer_move()

    return state.game.state()


@router.get("/state")
def get_state():

    if state.game is None:
        return {}

    return state.game.state()
