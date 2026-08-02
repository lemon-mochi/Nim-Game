"""
server.py
---------
This file handles communication with the frontend of the web app.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers.nim import router as nim_router
from routers.wythoffs import router as wythoff_router

app = FastAPI()

load_dotenv(dotenv_path=".env")
origin = os.getenv("ORIGIN")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=[origin],
)

app.include_router(nim_router)
app.include_router(wythoff_router)
