package war;

import java.util.ArrayList;

/**
 * Combinations is an interface for generating and analyzing
 * pitch class set combinations.
 *
 * All methods work with ArrayList<Integer> for pitch class sets
 * and ArrayList<ArrayList<Integer>> for collections of sets.
 */
public interface Combinations {
    //Be sure to initialize these somewhere in your implementation
    //prior to the method calls for access to the instance methods 
    //of PrimeFormCalculator and MoreStatsCalculator. Do this either
    //in the constuctor or in a static block
    PrimeForm pfc = null;
    MoreStats msc = null;
    /**
     * Implement the standard recursive combination generation algorithm.
     * 
     * Takes as input a partial combination of zero or more elements.
     * Returns every combination with {@code card} elements that contains the
     * input partialComb as a subset.
     * 
     * - If the partial set's cardinality is less than {@code card}, one note is appended
     *   and the resulting set is passed to the method again recursively to find
     *   every combination including this subset.
     * - Notes should be added in ascending order only, to avoid duplicate combinations.
     * - If partialComb's cardinality equals {@code card}, partialComb is returned.
     *   (In this case, partialComb is the only set of this cardinality that
     *   includes all the elements of partialComb.)
     *
     * @param partialComb an ArrayList<Integer> representing a partial combination.
     * @param card the target cardinality (size) of the combinations.
     * @return an ArrayList<ArrayList<Integer>> containing all combinations.
     */
    ArrayList<ArrayList<Integer>> getAllCombinations(ArrayList<Integer> partialComb, int card);

    /**
     * Takes a collection of pitch class sets (ArrayList of ArrayLists).
     * Returns only the transpositionally unique sets found in the input
     * (unique set classes).
     * 
     * You will need to convert sets to prime form using pfc.getPrimeForm.
     * The results should be returned in prime form.
     *
     * @param sets an ArrayList<ArrayList<Integer>> representing a collection of sets.
     * @return an ArrayList<ArrayList<Integer>> containing only unique set classes.
     */
    ArrayList<ArrayList<Integer>> getUniqueSetClasses(ArrayList<ArrayList<Integer>> sets);

    /**
     * Determines the unique combinations for the given cardinality
     * and returns them as an ArrayList of ArrayLists.
     * 
     * Uses getAllCombinations to get all pitch class sets of a given cardinality,
     * then passes this output through getUniqueSetClasses to filter out only
     * unique set classes.
     *
     * @param card the target cardinality (size) of the combinations.
     * @return an ArrayList<ArrayList<Integer>> containing unique combinations.
     */
    ArrayList<ArrayList<Integer>> getUniqueCombinations(int card);

    /**
     * Takes a set of numbers (ArrayList<Integer>) and returns the numbers as
     * a base-ten number written backwards.
     * 
     * Example: [1, 2, 3, 0, 1, 0] yields the number 10321.
     *
     * @param digits an ArrayList<Integer> representing the digits.
     * @return an int containing the base-ten number.
     */
    int getBaseTen(ArrayList<Integer> digits);

    /**
     * Using getUniqueCombinations, put the combinations into a lexicographical order.
     * 
     * The order follows Forte's with a Rahn-Solomon flavor:
     * - First sort by interval vector, treating the six digits of the IV
     *   as digits of a base-ten number written backward. Use getBaseTen for this.
     * - Where two sets have the same IV, they are "zygotic" or "z-related."
     *   The set more densely packed to the left gets placed in its natural
     *   position based on the IV. The other set gets tacked onto the end,
     *   but still follows the natural IV-based ordering at the end.
     * 
     * Returns both the sorted list and a list of zygotic sets wrapped in the
     * provided wrapper class.
     * 
     * Depends on msc.getIntervalVector
     *
     * @param card the target cardinality (size) of the combinations.
     * @return an ArrayList<ArrayList<Integer>> containing the sorted unique combinations.
     */
    LexicographicWrapper getSortedUniqueCombinations(int card);

    /**
     * Takes a set (ArrayList<Integer>) in ascending order.
     * 
     * Using the helper methods above, return the Rahn-Solomon flavored
     * Forte number, i.e. a string "cardinality-lexicographical_index".
     * 
     * If the input is zygotic, add "Z" to the cardinality, e.g.
     * "3Z-12".
     *
     * @param set an ArrayList<Integer> representing a pitch class set.
     * @return a String containing the Forte number.
     */
    public String getForteNumber(ArrayList<Integer> set);
}
