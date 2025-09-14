from abc import ABC, abstractmethod

class Combinations(ABC):
    def __init__(self, primeFormCaluclator, moreStatsCalculator):
        self.pfc = primeFormCaluclator
        self.msc = moreStatsCalculator

    #Implement the standard recursive combination generation algorithm
    #Takes as input a partial combination of zero or more elements.
    #Returns every combination with card elements that contains the
    #input partialComb as a subset.
    #If the partial set's cardinality is less than card, one note is appended
    #and the resulting set is passed to the method again recursively to find
    #every combination including this subset.
    #Notes should be added in ascending order only, to avoid duplicate combinations.
    #If partialComb's cardinality equals card, partialComb is returned.
    #(in this case, partialComb is the only set of this cardinality that
    #includes all the elements of partial comb)
    @abstractmethod
    def getAllCombinations(self, partialComb, card):
        pass

    # Takes a list of lists representing an arbitrary collection
    # of pitch class sets.
    # Returns a list of only the transpositionally unique sets
    # found in the input (unique set classes).
    # You will need to convert sets to prime form.
    # return the results in prime form
    @abstractmethod
    def getUniqueSetClasses(self, sets):
        pass

    #determines the unqiue combinations for the given cardinality
    # and return them as a list of lists. Uses getAllCombinations
    # to get all pitch class sets of a given cardinality and passes
    # this output through getUniqueSetClasses to filter out only 
    # unique set classes from this list
    @abstractmethod
    def getUniqueCombinations(self, card):
        pass

    # takes a set of numbers (list) and returns the numbers as
    # a base ten number written backwards. E.g. [1,2,3,0,1,0]
    # yields the number 10,321
    @abstractmethod
    def getBaseTen(self, digits):
        pass

    #using getUniqueCombinations put the combinations into a lexicographical
    #order. the order follows Forte's with a Rahn-Solomon flavor.
    #First sort by interval vector, treating the six digits of the iv
    #as digits of a base-ten number written backward. Use getBaseTen for this.
    #Where two sets have the same iv, they are 'zygotic' or 'z-related'
    #the set more densly packed to the left gets placed in its natural
    #position based on the iv. The other set, gets tacked onto the end,
    #but still following the natural iv-based ordering at the end.
    #returns the sorted list and a list of zygotic sets
    #depends on self.msc.getIntervalVector
    @abstractmethod
    def getSortedUniqueCombinations(self, card):
        pass

    #takes a set in ascending order
    # using the helper method above, return the Rahn-Solomon flavored
    #Forte number, i.e. a string "cardinality-lexicographical_index"
    #If the input is zygotic, add Z to the cardinality, i.e.
    #"cardinalityZ-lexicographical_index"
    @abstractmethod
    def getForteNumber(self, card):
        pass
    
    