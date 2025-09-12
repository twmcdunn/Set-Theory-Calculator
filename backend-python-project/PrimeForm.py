from abc import ABC, abstractmethod

class PrimeForm(ABC):
    @abstractmethod
    def transToZero(self, set):
        pass

    @abstractmethod
    def getAllRotations(self, set):
        pass
    
    # Helper method: compares two sets and returns the one most densely packed to the left
    # If there's a tie, breaks it by comparing intervals from largest to smallest
    # Follow Rahn's algorithm. There's only one heuristic for "most packed to the left"
    # (In Forte's version, which is less popular now, we compare starting from the smallest
    # generic interval and moving to the largest, after finding the smallest framing interval)
    @abstractmethod
    def mostDenseToTheLeft(self, set1, set2):
        pass

    @abstractmethod
    def normalOrder(self, set):
        pass

    @abstractmethod
    def putInAscendingOrder(self, set):
        pass

    @abstractmethod
    def getPrimeForm(self, set):
        pass