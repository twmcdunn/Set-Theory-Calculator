package war;

import java.util.ArrayList;

/**
 * MoreStats is an interface for analyzing pitch class sets.
 * 
 * All methods work with ArrayList<Integer>.
 * - Inputs: ArrayList<Integer> (usually in ascending order).
 * - Outputs: ArrayList<Integer> or boolean, depending on the method.
 * 
 */
public interface MoreStats {
    //Be sure to initialize this somewhere in your implementation
    //prior to the method calls for access to the instance methods 
    //of PrimeFormCalculator. Do this either in the constuctor or
    //in a static block
    PrimeForm pfc = null;

    /**
     * Takes a set (ArrayList<Integer>) in ascending order.
     * Returns a vector (ArrayList<Integer>) tallying the instances
     * of each of the 6 interval classes.
     *
     * @param set an ArrayList<Integer> representing a pitch class set.
     * @return an ArrayList<Integer> containing the interval vector.
     */
    public ArrayList<Integer> getIntervalVector(ArrayList<Integer> set);

    /**
     * Takes a set (ArrayList<Integer>) in ascending order.
     * Returns all transpositions of the set as an ArrayList of ArrayLists.
     *
     * @param set an ArrayList<Integer> representing a pitch class set.
     * @return an ArrayList<ArrayList<Integer>> containing all transpositions.
     */
    public ArrayList<ArrayList<Integer>> getAllTranspositions(ArrayList<Integer> set);

    /**
     * Uses the getAllTranspositions method on the set.
     * Checks if the set contains all the members of more than one of the transpositions.
     * If so, return true. Otherwise, return false.
     *
     * Depends on getAllTranspositions.
     *
     * @param setInput an ArrayList<Integer> representing a pitch class set.
     * @return true if the set is transpositionally symmetrical, false otherwise.
     */
    public boolean isTranspositionallySymmetrical(ArrayList<Integer> setInput);

    /**
     * Takes a set (ArrayList<Integer>).
     * Returns the set inverted (12 - each member) and put into normal order,
     * transposed to zero (Solomon's prime form).
     *
     * @param set an ArrayList<Integer> representing a pitch class set.
     * @return an ArrayList<Integer> containing the inversion in prime form.
     */
    public ArrayList<Integer> getInversion(ArrayList<Integer> set);

    /**
     * Takes a set (ArrayList<Integer>).
     * Returns a boolean indicating whether the set is inversionally symmetrical.
     *
     * A set is inversionally symmetrical if the normal form
     * (Solomon's prime form) of the set equals the normal form of the inversion.
     *
     * Depends on getInversion and pfc.getPrimeForm.
     *
     * @param set an ArrayList<Integer> representing a pitch class set.
     * @return true if the set is inversionally symmetrical, false otherwise.
     */
    public boolean isInversionallySymmetrical(ArrayList<Integer> set);

    /**
     * Takes a set (ArrayList<Integer>).
     * Returns the 12-tone complement in normal form (Solomon's prime form).
     *
     * Depends on pfc.getPrimeForm.
     *
     * @param set an ArrayList<Integer> representing a pitch class set.
     * @return an ArrayList<Integer> containing the complement in prime form.
     */
    public ArrayList<Integer> getComplement(ArrayList<Integer> set);
}
