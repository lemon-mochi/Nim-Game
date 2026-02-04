import random
from functools import reduce
from operator import xor


def nim_sum(piles):
    return reduce(xor, piles, 0)


def is_winning(piles):
    return nim_sum(piles) != 0


def optimal_move(piles):
    """
    Returns (pile_index, new_size)
    """
    ns = nim_sum(piles)

    for i, pile in enumerate(piles):
        target = pile ^ ns
        if target < pile:
            return i, target

    # Should never happen if position is winning
    return None


def rigged_random_game(num_piles, min_sticks, max_sticks, computer_first):
    """
    Generate a random game that is winning for the player
    who goes first.
    """
    while True:
        piles = [
            random.randint(min_sticks, max_sticks)
            for _ in range(num_piles)
        ]

        winning = is_winning(piles)
        if winning == computer_first:
            return piles
