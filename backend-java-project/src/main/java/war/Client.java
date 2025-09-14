package war;

import java.util.ArrayList;
import org.teavm.jso.JSBody;
import org.teavm.jso.JSExport;
import org.teavm.jso.dom.html.HTMLDocument;

public class Client {
    public static PrimeForm pfc = null;
    public static MoreStats statsImpl = null;
    public static Combinations cc = null;
    static {
        try {
            Class<?> impl = Class.forName("war.PrimeFormCalculator");
            if (PrimeForm.class.isAssignableFrom(impl)) {
                pfc = (PrimeForm) impl.newInstance();
            }
        } catch (Exception e) {
        }
        try {
            Class<?> impl = Class.forName("war.MoreStatsCalculator");
            if (MoreStats.class.isAssignableFrom(impl)) {
                statsImpl = (MoreStats) impl.newInstance();
            }
        } catch (Exception e) {
        }
        try {
            Class<?> impl = Class.forName("war.CombinationsCalculator");
            if (Combinations.class.isAssignableFrom(impl)) {
                cc = (Combinations) impl.newInstance();
            }
        } catch (Exception e) {
        }
    }

    public static void main(String[] args) {
        var document = HTMLDocument.current();
        var div = document.createElement("div");
        div.appendChild(document.createTextNode("TeaVM generated element"));
        document.getBody().appendChild(div);
    }

    @JSBody(params = { "message" }, script = "console.log(message);")
    public static native void consoleLog(String message);

    public static ArrayList<Integer> arrToAL(int[] arr) {
        ArrayList<Integer> al = new ArrayList<Integer>();
        for (int note : arr) {
            al.add(note);
        }
        return al;
    }

    public static int[] alToArr(ArrayList<Integer> al) {
        int[] arr = new int[al.size()];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = al.get(i);
        }
        return arr;
    }

    @JSExport
    public static int[] getPrimeForm(int[] set) {
        if (pfc == null)
            return null;
        ArrayList<Integer> alSet = arrToAL(set);

        ArrayList<Integer> alPf = pfc.getPrimeForm(alSet);

        int[] pf = alToArr(alPf);
        return pf;
    }

    @JSExport
    public static int[] getIntervalVector(int[] set) {
        if (statsImpl == null)
            return null;
        ArrayList<Integer> alSet = arrToAL(set);
        ArrayList<Integer> alIV = statsImpl.getIntervalVector(alSet);
        return alToArr(alIV);
    }

    @JSExport
    public static boolean isTranspositionallySymmetrical(int[] set) {
        if (statsImpl == null)
            return false;
        ArrayList<Integer> alSet = arrToAL(set);
        return statsImpl.isTranspositionallySymmetrical(alSet);
    }

    @JSExport
    public static int[] getInversion(int[] set) {
        if (statsImpl == null)
            return null;
        ArrayList<Integer> alSet = arrToAL(set);
        ArrayList<Integer> alInv = statsImpl.getInversion(alSet);
        return alToArr(alInv);
    }

    @JSExport
    public static boolean isInversionallySymmetrical(int[] set) {
        if (statsImpl == null)
            return false;
        ArrayList<Integer> alSet = arrToAL(set);
        return statsImpl.isInversionallySymmetrical(alSet);
    }

    @JSExport
    public static int[] getComplement(int[] set) {
        if (statsImpl == null)
            return null;
        ArrayList<Integer> alSet = arrToAL(set);
        ArrayList<Integer> alComp = statsImpl.getComplement(alSet);
        return alToArr(alComp);
    }

    @JSExport
    public static String getForteNumber(int[] set) {
        if (statsImpl == null)
            return null;
        ArrayList<Integer> alSet = arrToAL(set);
        return cc.getForteNumber(alSet);
    }
}
