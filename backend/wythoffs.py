"""
wythoffs.py
-----------
This file contains the code needed to run the backend of Wythoff's game
"""

from enum import Enum
import math

PHI = (1 + math.sqrt(5)) / 2


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


class Game:
    # is_pvp = False  # whether game is played between two people or person vs computer
    # is_balanced_flag = True  # whether the game is balanced or not
    # player_goes_first = True # whether the player
    # goes first or the computer goes first
    # random_gmae = True  # whether the piles should be randomized or not
    # game_over = False
    # x represents the value of the first pile
    # y represents the value of the second pile

    def is_balanced(self) -> None:
        if self.x > self.y:
            temp_x, temp_y = self.y, self.x
        else:
            temp_x, temp_y = self.x, self.y
        k = temp_y - temp_x
        return temp_x == int(k * PHI)

    def play_round(self, move_type: MoveType, to_subtract: int) -> None:
        # this function plays one move in the game
        if to_subtract <= 0:
            return

        match move_type:
            case MoveType.FIRST_PILE:
                if to_subtract > self.x:
                    return

                self.x -= to_subtract

            case MoveType.SECOND_PILE:
                if to_subtract > self.y:
                    return

                self.y -= to_subtract

            case MoveType.BOTH:
                if to_subtract > self.x or to_subtract > self.y:
                    return

                self.x -= to_subtract
                self.y -= to_subtract

        if self.x == 0 and self.y == 0:
            self.game_over = True

    def optimal_computer_move(self) -> None:
        swapped = False
        if self.x > self.y:
            temp_x, temp_y = self.y, self.x
            swapped = True
        else:
            temp_x, temp_y = self.x, self.y

        if self.is_balanced():
            # game is balanced. No optimal move exists.
            # moves to avoid: reducing one pile to 0; equalizing both piles
            # safeset move is to remove one from the smaller pile,
            # unless the smaller pile only has one stone
            if temp_x == 1:
                # this means one pile is at 1 and the other isn't.
                # The computer does not want to reduce the pile with 1 to 0.
                if swapped:
                    self.play_round(move_type=MoveType.FIRST_PILE, to_subtract=1)
                else:
                    self.play_round(move_type=MoveType.SECOND_PILE, to_subtract=1)
            else:
                # simply take one from the smaller pile
                if swapped:
                    self.play_round(move_type=MoveType.SECOND_PILE, to_subtract=1)
                else:
                    self.play_round(move_type=MoveType.FIRST_PILE, to_subtract=1)

        else:
            # Strategy 1: Take from BOTH piles equally
            # The difference between piles (k) remains identical.
            k = self.y - self.x
            a = int(k * PHI)
            if temp_x >= a:
                amt = temp_x - a
                if amt > 0:
                    self.play_round(move_type=MoveType.BOTH, to_subtract=amt)

            # Strategy 2: Take from the LARGER pile (currently y)
            # We must find a P-position that already contains 'x' as one of its values.

            # Check if x represents the smaller value (a_k) in a P-position pair
            k_est = int(temp_x * (PHI - 1))
            for k in (k_est - 1, k_est, k_est + 1, k_est + 2):
                if k >= 0 and int(k * PHI) == temp_x:
                    target_y = temp_x + k
                    if temp_y > target_y:
                        if swapped:
                            self.play_round(
                                move_type=MoveType.FIRST_PILE,
                                to_subtract=temp_y - target_y,
                            )
                        else:
                            self.play_round(
                                mvoe_type=MoveType.SECOND_PILE,
                                to_subtract=temp_y - target_y,
                            )

            # Check if x represents the larger value (b_k) in a P-position pair
            k_est = int(temp_x * (2 - PHI))
            for k in (k_est - 1, k_est, k_est + 1, k_est + 2):
                if k >= 0 and int(k * PHI) + k == temp_x:
                    target_y = int(k * PHI)
                    if temp_y > target_y:
                        if swapped:
                            self.play_round(
                                move_type=MoveType.FIRST_PILE,
                                to_subtract=temp_y - target_y,
                            )
                        else:
                            self.play_round(
                                move_type=MoveType.SECOND_PILE,
                                to_subtract=temp_y - target_y,
                            )

            # Strategy 3: Take from the SMALLER pile (currently x)
            # We must find a P-position that already contains 'y'
            # as its larger value (b_k).
            k_est = int(temp_y * (2 - PHI))
            for k in (k_est - 1, k_est, k_est + 1, k_est + 2):
                if k >= 0 and int(k * PHI) + k == temp_y:
                    target_x = int(k * PHI)
                    if temp_x > target_x:
                        if swapped:
                            self.play_round(
                                move_type=MoveType.SECOND_PILE,
                                to_subtract=temp_x - target_x,
                            )
                        else:
                            self.play_round(
                                move_type=MoveType.FIRST_PILE,
                                to_subtract=temp_x - target_x,
                            )

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
