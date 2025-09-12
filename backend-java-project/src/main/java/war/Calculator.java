package war;

import java.util.ArrayList;

import org.teavm.jso.JSExport;

//Generates primeform as stipulated by Larry Solomon (i.e. ignoring inversional equivalence)
public interface Calculator {

    public ArrayList<Integer> tansToZero(ArrayList<Integer> set);

    public ArrayList<ArrayList<Integer>> getAllRotations(ArrayList<Integer> set);

    public ArrayList<Integer> normalOrder(ArrayList<Integer> set);

    public ArrayList<Integer> putInAscendingOrder(ArrayList<Integer> set);

    // takes set of unique ints in mod 12;
    // outputs normal order transposed to zero ("prime form")
    @JSExport
    public ArrayList<Integer> getPrimeForm(ArrayList<Integer> set);
}
