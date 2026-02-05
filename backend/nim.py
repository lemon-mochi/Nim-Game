import numpy as np
from prettytable import PrettyTable


class Game:
    is_pvp = False  # whether game is played between two people or person vs computer
    is_balanced_flag = True  # whether the game is balanced or not
    player_goes_first = True  # whether the player goes first or the computer goes first
    random_gmae = True  # whether the piles should be randomized or not
    game_over = False

    num_piles = 10
    min_per_pile = 5
    max_per_pile = 20

    nim_sum: int = 0

    def is_balanced(self) -> None:
        self.nim_sum = np.bitwise_xor.reduce(self.piles)
        self.is_balanced_flag = True if self.nim_sum == 0 else False

    def check_game_over(self):
        self.game_over = (self.piles == 0).all()

    def play_round(self, pile_idx: int, to_subtract: int) -> None:
        # this function plays one move in the game

        if pile_idx > (self.num_piles - 1):
            return

        if to_subtract > self.piles[pile_idx]:
            return

        self.piles[pile_idx] -= to_subtract
        if self.piles[pile_idx] == 0:
            self.check_game_over()

        self.is_balanced()

    def computer_move(self):
        # this function determines the best option for the computer player
        if self.is_balanced_flag:
            most_sticks = np.argmax(self.piles)
            self.play_round(pile_idx=most_sticks, to_subtract=1)

        else:
            # must balance the game
            piles = self.piles.astype(int)
            # Largest power of 2 with odd count is highest set bit of nim_sum
            m = int(np.floor(np.log2(self.nim_sum)))
            mask = 1 << m

            # Choose a pile that has this bit
            candidates = np.where((piles & mask) != 0)[0]
            i = candidates[0]

            # New pile size after the move
            new_size = piles[i] ^ self.nim_sum

            sticks_removed = piles[i] - new_size
            self.play_round(pile_idx=i, to_subtract=sticks_removed)

    def generate_random_pile(self, num_piles=10, min_per_pile=5, max_per_pile=20):
        self.piles = np.random.randint(
            low=min_per_pile, high=max_per_pile + 1, size=num_piles
        )
        self.is_balanced()

    def create_random_pile(self, num_piles=10, min_per_pile=5, max_per_pile=20) -> None:
        self.generate_random_pile(num_piles, min_per_pile, max_per_pile)

        # if the computer is first, the game should be unbalanced.
        # if the player is first, the game should be unbalanced.
        # if the game is person vs person, it does not matter
        if not self.is_pvp:
            if not self.is_balanced_flag and self.player_goes_first:
                # Idea: Add some sticks and then perform a
                # move to bring it to a balanced state
                smallest_pile = np.argmin(self.piles)
                self.piles[smallest_pile] = max_per_pile
                self.is_balanced()

                self.computer_move()
                if (self.piles < min_per_pile).any():
                    print("Do something to handle this case later")

            if self.is_balanced_flag and not self.player_goes_first:
                # subtract one from the largest pile.
                # Excpet for weird case where the largest pile has the minimum.
                largest_pile = np.argmax(self.piles)
                if self.piles[largest_pile] == min_per_pile:
                    self.piles[largest_pile] += 1
                else:
                    self.piles[largest_pile] -= 1

                self.is_balanced()

    def create_custom_pile(self, num_piles: int, num_per_array: np.ndarray) -> None:
        self.piles = np.zeros(num_piles)
        for i in range(num_piles):
            self.piles[i] = num_per_array[i]

        self.is_balanced()

    def display_piles(self):
        # this function is for displaying the pile nicely in the terminal
        table = PrettyTable()
        table.field_names = np.arange(0, self.num_piles)
        table.add_row(self.piles)
        print(table)

    def display_info(self):
        # used for debugging
        print("The nim sum of the current state is: ", self.nim_sum)
        if self.is_balanced_flag:
            print("Game is balanced")
        else:
            print("Game is not balanced")

    def __init__(
        self,
        is_pvp: bool,
        player_goes_first: bool,
        num_piles: int,
        min_per_pile: int,
        max_per_pile: int,
        random_game: bool,
        num_per_array=None,
    ):
        self.is_pvp = is_pvp
        self.player_goes_first = player_goes_first
        self.num_piles = num_piles
        self.min_per_pile = min_per_pile
        self.max_per_pile = max_per_pile

        if random_game:
            self.create_random_pile(num_piles, min_per_pile, max_per_pile)
        else:
            self.create_custom_pile(num_piles, num_per_array)
