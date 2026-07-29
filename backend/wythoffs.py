from enum import Enum
import math

PHI = (1 + math.sqrt(5)) / 2


class Difficulty(Enum):
    EASY = 1
    MEDIUM = 2
    HARD = 3
    VERY_HARD = 4
    IMPOSSIBLE = 5


class Game:
    # is_pvp = False  # whether game is played between two people or person vs computer
    # is_balanced_flag = True  # whether the game is balanced or not
    # player_goes_first = True # whether the player
    # goes first or the computer goes first
    # random_gmae = True  # whether the piles should be randomized or not
    # game_over = False
    # x represents the value of the first pile
    # y represents the value of the second pile

    def is_balanced(self):
        if self.x > self.y:
            temp_x, temp_y = self.y, self.x
        else:
            temp_x, temp_y = self.x, self.y
        k = temp_y - temp_x
        return temp_x == int(k * PHI)

    def __init__(
        self,
        is_pvp: bool,
        player_goes_first: bool,
        random_game: bool,
        x: int,
        y: int,
        diff_level: Difficulty = Difficulty.EASY,
    ):
        self.is_pvp = is_pvp
        self.player_goes_first = player_goes_first
        self.random_game = random_game
        self.x = x
        self.y = y
        self.diff_level = diff_level

        self.game_over = False
