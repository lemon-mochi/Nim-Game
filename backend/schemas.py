from pydantic import BaseModel
from typing import List


class CreateRandomGame(BaseModel):
    num_piles: int
    min_sticks: int
    max_sticks: int
    computer_first: bool


class CreateCustomGame(BaseModel):
    piles: List[int]


class ComputerMoveRequest(BaseModel):
    piles: List[int]


class ComputerMoveResponse(BaseModel):
    pile_index: int
    new_size: int
