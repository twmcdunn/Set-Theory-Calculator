package war;

import java.util.ArrayList;

public class LexicographicWrapper {
    ArrayList<ArrayList<Integer>> fullOrderedList, zygoticSets;

    public LexicographicWrapper(ArrayList<ArrayList<Integer>> fullOrderedList,
            ArrayList<ArrayList<Integer>> zygoticSets) {
        this.fullOrderedList = fullOrderedList;
        this.zygoticSets = zygoticSets;
    }

    public ArrayList<ArrayList<Integer>> getFullOrderedList() {
        return fullOrderedList;
    }

    public ArrayList<ArrayList<Integer>> getZygoticSets() {
        return zygoticSets;
    }
}
