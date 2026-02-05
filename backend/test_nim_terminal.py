from nim import Game


is_pvp = False
player_goes_first = True
num_piles = 10
min_per_pile = 5
max_per_pile = 20
random_game = True


# True means it the current player is the player.
# False means the current player is the computer
current_player = True

game = Game(
    is_pvp=is_pvp,
    player_goes_first=player_goes_first,
    num_piles=10,
    min_per_pile=5,
    max_per_pile=20,
    random_game=True,
)

while not game.game_over:
    game.display_piles()
    if current_player:
        print("Choose a pile to reomve from")
        # assume the user will only enter a whole number
        idx = int(input())
        print("How many sticks will you pick up?")
        to_pick_up = int(input())
        if idx > (game.num_piles - 1) or idx < 0:
            print("invalid pile choice")
            continue
        if to_pick_up > game.piles[idx] or to_pick_up < 1:
            print("Not enough sticks to remove")
            continue
        game.play_round(pile_idx=idx, to_subtract=to_pick_up)

    else:
        print("Computer's move")
        game.computer_move()

    current_player = False if current_player else True

print(game.display_piles())
if current_player:
    print("Computer player won")
else:
    print("YOU'RE WINNER !")  # big rigs over the road racing
