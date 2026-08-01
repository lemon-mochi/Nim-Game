from enum import Enum


class Difficulty(Enum):
    EASY = 1
    MEDIUM = 2
    HARD = 3
    VERY_HARD = 4
    IMPOSSIBLE = 5


class MoveType(Enum):
    FIRST_PILE = 1
    SECOND_PILE = 2
    BOTH = 3
