from pyodide.ffi import create_proxy
pfc = None
try:
    from PrimeFormCalculator import PrimeFormCalculator
    pfc = PrimeFormCalculator()
except Exception:
    pass

msc = None
try:
    from MoreStatsCalculator import MoreStatsCalculator
    msc = MoreStatsCalculator(pfc)
except Exception:
    pass

cc = None
try:
    from CombinationsCalculator import CombinationsCalculator
    cc = CombinationsCalculator(pfc)
except Exception:
    pass

import js

def getPF(set):
    return pfc.getPrimeForm(set)

def getIV(set):
    return msc.getIntervalVector(set)

def getTS(set):
    return msc.isTranspositionallySymmetrical(set)

def getI(set):
    return msc.getInversion(set)

def getIS(set):
    return msc.isInversionallySymmetrical(set)

def getC(set):
    return msc.getComplement(set)

def getFN(set):
    return cc.getForteNumber(set)


if 'PrimeFormCalculator' in locals():
    getPrimeFormpy = create_proxy(getPF)
    js.globalThis.getPrimeForm = getPrimeFormpy

if 'MoreStatsCalculator' in locals():
    getIntervalVectorpy = create_proxy(getIV)
    isTranspositionallySymmetricalpy = create_proxy(getTS)
    getInversionpy = create_proxy(getI)
    isInversionallySymmetricalpy = create_proxy(getIS)
    getComplementpy = create_proxy(getC)
    js.globalThis.getIntervalVector = getIntervalVectorpy
    js.globalThis.isTranspositionallySymmetrical = isTranspositionallySymmetricalpy
    js.globalThis.getInversion = getInversionpy
    js.globalThis.isInversionallySymmetrical = isInversionallySymmetricalpy
    js.globalThis.getComplement = getComplementpy

if 'CombinationsCalculator' in locals():
    getForteNumberpy = create_proxy(getFN)
    js.globalThis.getForteNumber = getForteNumberpy

