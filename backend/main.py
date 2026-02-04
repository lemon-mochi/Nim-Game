from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    CreateRandomGame,
    CreateCustomGame,
    ComputerMoveRequest,
    ComputerMoveResponse,
)
from nim import rigged_random_game, optimal_move

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/game/random")
def create_random_game(req: CreateRandomGame):
    piles = rigged_random_game(
        req.num_piles,
        req.min_sticks,
        req.max_sticks,
        req.computer_first,
    )
    return {"piles": piles}


@app.post("/game/custom")
def create_custom_game(req: CreateCustomGame):
    return {"piles": req.piles}


@app.post("/move/computer", response_model=ComputerMoveResponse)
def computer_move(req: ComputerMoveRequest):
    move = optimal_move(req.piles)
    if move is None:
        raise ValueError("Computer called on losing position")

    pile_index, new_size = move
    return ComputerMoveResponse(
        pile_index=pile_index,
        new_size=new_size,
    )
