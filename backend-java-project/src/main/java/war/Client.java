package war;

import java.util.ArrayList;

import org.teavm.jso.JSExport;
import org.teavm.jso.dom.html.HTMLDocument;

public class Client {
    public static void main(String[] args) {
        var document = HTMLDocument.current();
        var div = document.createElement("div");
        div.appendChild(document.createTextNode("TeaVM generated element"));
        document.getBody().appendChild(div);
    }

    @JSExport
    public static int[] getPrimeForm(int[] set) {
        ArrayList<Integer> alSet = new ArrayList<Integer>();
        for (int note : set) {
            alSet.add(note);
        }
        Calculator calc = new PrimeFormCalculator();
        ArrayList<Integer> alPf = calc.getPrimeForm(alSet);
        int[] pf = new int[alPf.size()];
        for (int i = 0; i < pf.length; i++) {
            pf[i] = alPf.get(i);
        }
        return pf;
    }
}
