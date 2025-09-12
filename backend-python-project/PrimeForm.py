from abc import ABC, abstractmethod

class PrimeForm(ABC):
    #  Takes a set of unique ints in mod 12.
    #  Returns the set transposed such that the first note is zero
    #  and all notes are in mod twelve (positive ints 0 - 11)
    @abstractmethod
    def transToZero(self, set):
        pass

    # Takes a set of unique ints in mod 12 in an ascending order.
    # Returns all possible rotations of the set, each transposed
    # such that the first note is zero.
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

    # Takes set of ints in mod 12 in ascending order (an ascending order)
    # Returns the notes in normal order, starting on zero

    #Depends on mostDenseToTheLeft
    @abstractmethod
    def normalOrder(self, set):
        pass

    #pretty self-explanitory
    @abstractmethod
    def putInAscendingOrder(self, set):
        pass

    #takes a set (list) of unique mod-twelve numbers,
    # puts them in ascending order using the helper method
    # gets the normal order of the ascending-ordered set using
    # the helper method, and returns the result (a list)

    #depends on self.putInAscendingOrder and self.normalOrder
    @abstractmethod
    def getPrimeForm(self, set):
        pass