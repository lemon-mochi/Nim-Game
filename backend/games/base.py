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
