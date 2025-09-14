package war;

import java.util.ArrayList;
import java.util.Collections;

public class PrimeFormCalculator implements PrimeForm {

    /*
     * Takes a set of unique ints in mod 12.
     * Returns the set transposed such that the first note is zero
     * and all notes are in mod twelve (positive ints 0 - 11)
     */
    public ArrayList<Integer> tansToZero(ArrayList<Integer> set) {
        // instantiate a new array list to store the output
        // this is usually better practice that directly modifying the
        // input, in case the same obj is used elsewhere
        ArrayList<Integer> transposedSet = new ArrayList<Integer>();

        int firstNote = set.get(0);

        // we'll transpose up an octave (+12) and down
        // by the value of firstNote. This way none of the notes
        // is less than zero.
        int transpositionInterval = 12 - firstNote;

        // transpose each note by this interval
        for (int note : set) {
            int transposedNote = (note + transpositionInterval) % 12;
            transposedSet.add(transposedNote);
        }

        return transposedSet;
    }

    /*
     * Takes a set of unique ints in mod 12 in an ascending order.
     * Returns all possible rotations of the set, each transposed
     * such that the first note is zero.
     */
    public ArrayList<ArrayList<Integer>> getAllRotations(ArrayList<Integer> set) {
        // instantiate data structure that the method will populate
        ArrayList<ArrayList<Integer>> rotations = new ArrayList<ArrayList<Integer>>();

        // give each note in the set a turn being the first note
        for (int startIndex = 0; startIndex < set.size(); startIndex++) {
            // initiate an array list that will be populated with
            // the rotation beginning with the note at startIndex
            ArrayList<Integer> rotation = new ArrayList<Integer>();
            for (int i = 0; i < set.size(); i++) {// populate rotation
                int index = (startIndex + i) % set.size();
                rotation.add(set.get(index));
            }

            // transpose to zero
            rotation = tansToZero(rotation);

            // add the result as one option to the list of all
            // possible rotations, but only if it's new (i.e. unique)
            // n.b. transpositionally symmetrical sets will have
            // multiple copies of the same rotation
            if (!rotations.contains(rotation)) {
                rotations.add(rotation);
            }
        }
        return rotations;
    }

    /*
     * Takes set of ints in mod 12 in ascending order (an ascending order)
     * Returns the notes in normal order transposed to start on zero
     */
    public ArrayList<Integer> normalOrder(ArrayList<Integer> set) {
        // first get all possible rotations, then narrow it down step by step
        // to the rotation that is most densly packed to the left
        ArrayList<ArrayList<Integer>> mostCompactOrds = getAllRotations(set);

        // check the outermost interval first ("generic interval"), then move
        // inward to break any ties
        for (int genericInterval = set.size() - 1; genericInterval >= 0; genericInterval--) {

            // instantiate a data structure to hold the best order after
            // comparing this interval in each option. It needs to be an
            // Array of options, since there could be a tie
            ArrayList<ArrayList<Integer>> bestOrders = new ArrayList<ArrayList<Integer>>();

            int smallestSpecificInterval = Integer.MAX_VALUE;// dummy value

            // pass through our options once just to determine the smallest
            // specific interval for the given generic interval
            for (ArrayList<Integer> order : mostCompactOrds) {

                // n.b. order.get(0) is actually always zero at this point
                // we include it here just for the intelligibility of the logic
                int specificInterval = order.get(genericInterval) - order.get(0);

                smallestSpecificInterval = Math.min(smallestSpecificInterval, specificInterval);
            }

            // pass through our options again to add any that have the smallest
            // specific interval for the given generic interval. There may be
            // more than one
            for (ArrayList<Integer> order : mostCompactOrds) {
                int specificInterval = order.get(genericInterval);// - order.get(0);

                if (specificInterval == smallestSpecificInterval) {
                    // this order is the best option (or tied for best)
                    bestOrders.add(order);
                }
            }

            // if there's only one best option, we've broken all ties
            // and can return the winner
            if (bestOrders.size() == 1) {
                return bestOrders.get(0);
            }

            // if we haven't returned, then there is a tie
            // use all the options that are tied for best
            // as the input of the process above, now comparing
            // the next smallest generic interval
            mostCompactOrds = bestOrders;

        }

        // should be unreachable, but necissary to keep the compiler happy
        return null;
    }

    public ArrayList<Integer> putInAscendingOrder(ArrayList<Integer> set){
        Collections.sort(set);
        return set;
    }

    /*
     * Takes a set of unique ints in mod 12 in any order
     * returns the set in normal order transposed to zero
     * (solomonian prime form)
     */
    public ArrayList<Integer> getPrimeForm(ArrayList<Integer> set) {
        ArrayList<Integer> ascendingSet = putInAscendingOrder(set);
        return normalOrder(ascendingSet);
    }

    public static void main(String[] args) {
        int[] pf = Client.getPrimeForm(new int[] { 1, 2, 5 });
        System.out.println(pf);
    }
}
