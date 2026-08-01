from pydantic import BaseModel
from typing import List
from constants import Difficulty

# ------------------------------------
#    Classes for classical Nim
# ------------------------------------


class NewRandomGameRequest(BaseModel):
    is_pvp: bool
    player_goes_first: bool
    num_piles: int
    min_per_pile: int
    max_per_pile: int
    difficulty: Difficulty


class NewCustomGameRequest(BaseModel):
    is_pvp: bool
    player_goes_first: bool
    num_piles: int
    difficulty: Difficulty
    custom_piles: List[int]


class MoveRequest(BaseModel):
    pile_idx: int
    to_subtract: int
