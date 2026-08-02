"""
games/base.py
-------------
This file provides the definitions for the base methods needed in all games of Nim.
"""

from abc import ABC, abstractmethod


class BaseGame(ABC):

    @abstractmethod
    def computer_move(self):
        pass

    @abstractmethod
    def play_round(self, *args):
        pass

    @abstractmethod
    def state(self):
        pass
