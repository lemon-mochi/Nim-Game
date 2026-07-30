"""
test_wythoffs_game_terminal.py
------------------------------
This program runs a basic version of Wythoff's game in the termianl.
This is used for debugging the backend code.

Usage:
    python test_wythoffs_game_terminal.py
"""

from wythoffs import Game, Difficulty, MoveType, np
from prettytable import PrettyTable


is_pvp = False
player_goes_first = True
random_game = True
mode = Difficulty.IMPOSSIBLE

# True means the current player is the player.
# False means the current player is the computer
current_player = True


def display_piles(game: Game):
    # this function is for displaying the pile nicely in the terminal
    table = PrettyTable()
    table.field_names = np.arange(1, 3)
    table.add_row([game.x, game.y])
    print(table)


game = Game(
    is_pvp=False,
    player_goes_first=player_goes_first,
    min_per_pile=5,
    max_per_pile=20,
    random_game=True,
    diff_level=mode,
)

while not game.game_over:
    display_piles(game)
    if current_player:
        print(
            "Choose from the following:\n"
            "1: Remove from first pile\n"
            "2: Remove from second pile\n"
            "3: Remove from both piles"
        )
        # assume the user will only enter a whole number
        idx = int(input())
        print("How many stones will you pick up?")
        to_pick_up = int(input())
        if idx > 3 or idx < 1:
            print("invalid pile choice")
            continue
        match idx:
            case 1:
                if to_pick_up > game.x:
                    print("not enough stones to remove")
                    continue
                game.play_round(move_type=MoveType.FIRST_PILE, to_subtract=to_pick_up)
            case 2:
                if to_pick_up > game.y:
                    print("not enough stones to remove")
                    continue
                game.play_round(move_type=MoveType.SECOND_PILE, to_subtract=to_pick_up)
            case 3:
                if to_pick_up > game.x or to_pick_up > game.y:
                    print("not enough stones to remove")
                    continue
                game.play_round(move_type=MoveType.BOTH, to_subtract=to_pick_up)

    else:
        print("Computer's move")
        game.computer_move()

    current_player = False if current_player else True

print(display_piles(game))
if current_player:
    print("Computer player won")
else:
    print("YOU'RE WINNER !")  # big rigs over the road racing
