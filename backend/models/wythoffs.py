from pydantic import BaseModel
from constants import Difficulty, MoveType

# ------------------------------------
#   Classes for Wythoff's game
# ------------------------------------


class WythoffNewRandomGameRequest(BaseModel):
    is_pvp: bool
    player_goes_first: bool
    min_per_pile: int
    max_per_pile: int
    difficulty: Difficulty


class WythoffNewCustomGameRequest(BaseModel):
    is_pvp: bool
    player_goes_first: bool
    difficulty: Difficulty
    x: int
    y: int


class WythoffMoveRequest(BaseModel):
    move_type: MoveType
    to_subtract: int
