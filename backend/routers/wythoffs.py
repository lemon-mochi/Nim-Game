from fastapi import APIRouter

from games.wythoffs import WythoffGame
from models.wythoffs import (
    WythoffNewRandomGameRequest,
    WythoffNewCustomGameRequest,
    WythoffMoveRequest,
)
import state

router = APIRouter(prefix="/wythoffs", tags=["Wythoffs"])


@router.post("/new-random-game")
def new_random_game(req: WythoffNewRandomGameRequest):
    global game
    game = WythoffGame(
        is_pvp=req.is_pvp,
        player_goes_first=req.player_goes_first,
        min_per_pile=req.min_per_pile,
        max_per_pile=req.max_per_pile,
        diff_level=req.difficulty,
        random_game=True,
    )
    return get_state()


@router.post("new-custom-game")
def new_custom_game(req: WythoffNewCustomGameRequest):
    global game
    game = WythoffGame(
        is_pvp=req.is_pvp,
        player_goes_first=req.player_goes_first,
        diff_level=req.difficulty,
        x=req.x,
        y=req.y,
        diff_level=req.difficulty,
        random_game=False,
    )
    return get_state()


@router.post("/human-move")
def human_move(req: WythoffMoveRequest):
    game.play_round(req.move_type, req.to_subtract)

    return get_state()


@router.post("/computer-move")
def computer_move():
    game.computer_move()

    return get_state()


@router.get("/state")
def get_state():

    if state.game is None:
        return {}

    return state.game.state()
