"""
wythoffs.py
-----------
This file contains the code needed to run the backend of Wythoff's game
Inspiration from the following project:
https://github.com/LazarPajic/Math302-Wythoff-s-Game
"""

from enum import Enum
import math
import numpy as np

PHI = (1 + math.sqrt(5)) / 2
rng = np.random.default_rng()


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
        # Sort the piles so x <= y
        if self.x <= self.y:
            x, y = self.x, self.y
            smaller = MoveType.FIRST_PILE
            larger = MoveType.SECOND_PILE
        else:
            x, y = self.y, self.x
            smaller = MoveType.SECOND_PILE
            larger = MoveType.FIRST_PILE

        if self.is_balanced():
            # game is balanced. No optimal move exists.
            # moves to avoid: reducing one pile to 0; equalizing both piles
            # safeset move is to remove one from the smaller pile,
            # unless the smaller pile only has one stone
            if x == 1:
                # this means one pile is at 1 and the other isn't.
                # The computer does not want to reduce the pile with 1 to 0.
                self.play_round(move_type=larger, to_subtract=1)
                return
            else:
                # simply take one from the smaller pile
                self.play_round(move_type=smaller, to_subtract=1)
                return

        else:
            # ------------------------------------------------------------------
            # Strategy 1:
            # Remove equally from both piles.
            # ------------------------------------------------------------------
            k = y - x
            target_x = int(k * PHI)
            target_y = target_x + k

            if x >= target_x:
                amount = x - target_x

                if amount > 0 and y - amount == target_y:
                    self.play_round(move_type=MoveType.BOTH, to_subtract=amount)
                    return

            # ------------------------------------------------------------------
            # Strategy 2:
            # Remove only from the larger pile.
            # ------------------------------------------------------------------

            # Case 1: x is the smaller Beatty value.
            k_est = int(x * (PHI - 1))
            for k in range(max(0, k_est - 2), k_est + 3):
                if int(k * PHI) == x:
                    target_y = x + k
                    if y > target_y:
                        self.play_round(move_type=larger, to_subtract=y - target_y)
                        return

            # Case 2: x is the larger Beatty value.
            k_est = int(x * (2 - PHI))
            for k in range(max(0, k_est - 2), k_est + 3):
                if int(k * PHI) + k == x:
                    target_other = int(k * PHI)
                    if y > target_other:
                        self.play_round(move_type=larger, to_subtract=y - target_other)
                        return

            # ------------------------------------------------------------------
            # Strategy 3:
            # Remove only from the smaller pile.
            # ------------------------------------------------------------------
            k_est = int(y * (2 - PHI))
            for k in range(max(0, k_est - 2), k_est + 3):
                if int(k * PHI) + k == y:
                    target_x = int(k * PHI)
                    if x > target_x:
                        self.play_round(move_type=smaller, to_subtract=x - target_x)
                        return

            # ------------------------------------------------------------------
            # This should never happen if the strategy is correct.
            # ------------------------------------------------------------------
            raise RuntimeError(
                f"No optimal move found from position ({self.x}, {self.y})."
            )

    def easy_mode(self) -> None:
        rand_idx = rng.integers(low=1, high=4)
        if rand_idx == 1:
            to_pick_up = rng.integers(low=1, high=self.x + 1)
        if rand_idx == 2:
            to_pick_up = rng.integers(low=1, high=self.y + 1)
        else:
            to_pick_up = rng.integers(low=1, high=min(self.x, self.y) + 1)

        self.play_round(move_type=rand_idx, to_subtract=to_pick_up)

    def computer_move(self) -> None:
        # if there is one pile or both piles are the same,
        # the computer should win regardless of difficulty level
        if self.x == 0:
            self.play_round(move_type=MoveType.SECOND_PILE, to_subtract=self.y)
        elif self.y == 0:
            self.play_round(move_type=MoveType.FIRST_PILE, to_subtract=self.x)
        elif self.x == self.y:
            self.play_round(move_type=MoveType.BOTH, to_subtract=self.x)

        else:
            # the computer makes different moves depending on the difficulty level
            if self.diff_level == Difficulty.EASY:
                # if the difficulty level is easy,
                # pick a random move type and remove a random number of stones
                self.easy_mode()

            elif self.diff_level == Difficulty.MEDIUM:
                # with medium mode,
                # there is a 50% chance that the computer makes the optimal move
                random_int = np.random.randint(low=0, high=3)
                if random_int < 2:
                    self.easy_mode()
                else:
                    self.optimal_computer_move()

            elif self.diff_level == Difficulty.HARD:
                # if the game is near the end, the computer should make the optimal move
                if self.x <= 4 and self.y <= 4:
                    self.optimal_computer_move()
                else:
                    # in hard mode,
                    # there is a 75% chance that the computer makes the optimal move
                    random_int = np.random.randint(low=0, high=3)
                    if random_int < 1:
                        self.easy_mode()
                    else:
                        self.optimal_computer_move()

            else:
                # with very hard and impossible mode,
                # the computer alwasy makes the optimal move
                self.optimal_computer_move()

    def __init__(
        self,
        is_pvp: bool,
        player_goes_first: bool,
        random_game: bool,
        min_per_pile: int = 0,
        max_per_pile: int = 0,
        diff_level: Difficulty = Difficulty.EASY,
        x: int = None,
        y: int = None,
    ):
        self.is_pvp = is_pvp
        self.player_goes_first = player_goes_first
        self.random_game = random_game
        self.diff_level = diff_level

        if not random_game:
            self.x = x
            self.y = y
        else:
            if min_per_pile >= max_per_pile:
                raise ValueError(
                    "min_per_pile is greater than or equal to max_per_pile"
                )

            self.x = rng.integers(low=min_per_pile, high=max_per_pile + 1)
            self.y = rng.integers(low=min_per_pile, high=max_per_pile + 1)

            # x and y should not be the same, because then the game would become trivial
            while self.x == self.y:
                self.x = rng.integers(low=min_per_pile, high=max_per_pile + 1)
                self.y = rng.integers(low=min_per_pile, high=max_per_pile + 1)

            # in impossible mode, the game is actually impossible for the player to win
            # if the computer is first, the game should be unbalanced.
            # if the player is first, the game should be unbalanced.
            # if the game is person vs person, it does not matter

            if not self.is_pvp and self.diff_level == Difficulty.IMPOSSIBLE:
                if not self.is_balanced() and self.player_goes_first:
                    # Idea: keep generating boards until it is balanced

                    while not self.is_balanced() or self.x == self.y:
                        self.x = rng.integers(low=min_per_pile, high=max_per_pile + 1)
                        self.y = rng.integers(low=min_per_pile, high=max_per_pile + 1)

                if self.is_balanced() and not self.player_goes_first:
                    while self.is_balanced() or self.x == self.y:
                        self.x = rng.integers(low=min_per_pile, high=max_per_pile + 1)
                        self.y = rng.integers(low=min_per_pile, high=max_per_pile + 1)

        self.game_over = False
