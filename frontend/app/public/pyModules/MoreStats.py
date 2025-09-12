from abc import ABC, abstractmethod

class MoreStats(ABC):
    def __init__(self, primeFormCaluclator):
        self.pfc = primeFormCaluclator

    #takes a set (list) in ascending order
    #returns a vector (list) talling the instances of each
    #of the 6 interval classes
    @abstractmethod
    def getIntervalVector(self, set):
        pass

    #takes a set (list) in ascending order
    #returns all transpositions of the set as a list of lists
    @abstractmethod
    def getAllTranspositions(self, set):
        pass

    #use the getAllTranpositions method on the set
    #check if the set contains all the members of more 
    # than one of the transposions
    #if so, return true. otherwise false.
    #it might be helpful to convert the lists to sets for
    #easy comparison, but be careful to not shadow the set()
    #controcter in this scope. call the input something other
    #than set.

    #depends on self.getAllTranspositions
    @abstractmethod
    def isTranspositionallySymmetrical(self, setInput):
        pass


    #takes a set, returns the set inverted (12 - each member)
    #and in normal order tranposed to zero (Somolon's prime form)
    @abstractmethod
    def getInversion(self, set):
        pass

    #takes a set returns a boolean whether the set is
    #invesionally semmetrical
    #a set is inversionally semmetrical if the normal form
    #(solomon's prime form) of the set equals the normal 
    # form of the inversion.

    #depends on getInversion and PrimeForm.getPrimeForm
    @abstractmethod
    def isInversionallySymmetrical(self, set):
        pass
    
    #takes a set, returns the 12-tone complement in normal
    #form (solomon's prime form)

    #depends on PrimeForm.getPrimeForm
    @abstractmethod
    def getComplement(self, set):
        pass

    
