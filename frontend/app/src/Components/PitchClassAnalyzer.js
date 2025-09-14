import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Music, Piano, Hash, Sparkles, RotateCcw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import * as Tone from "tone";


const getPrimeForm = window.getPrimeForm || window.getPrimeFormpy;

// setTimeout(() => {
//     console.log('testFunction exists:', typeof window.testFunction);
//     console.log('testFunction result:', window.testFunction());
// }, 6000);

// setInterval(() => { console.log("function", window.getPrimeFormpy) }, 1000);

const PitchClassAnalyzer = ({ pyLoaded }) => {
    const [selectedNotes, setSelectedNotes] = useState(new Set());
    const [modInput, setModInput] = useState('');
    const [results, setResults] = useState(null);
    const [inputMode, setInputMode] = useState('piano'); // 'piano' or 'mod12'
    const toneStarted = useRef(false);


    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const blackKeys = [1, 3, 6, 8, 10];
    const synthRef = useRef(null);
    const muted = useRef(false);

    // useEffect(
    //     () => {
    //         synthRef.current = new Tone.PolySynth(Tone.FMSynth).toDestination();
    //     },
    //     []
    // );

    const handleNoteClick = async (noteIndex) => {
        const newSelected = new Set(selectedNotes);
        if (newSelected.has(noteIndex)) {
            newSelected.delete(noteIndex);
        } else {
            newSelected.add(noteIndex);
        }
        setSelectedNotes(newSelected);
        if (!toneStarted.current) {
            console.log("starting tone");
            await Tone.start();
            synthRef.current = new Tone.PolySynth(Tone.FMSynth).toDestination();
            toneStarted.current = true;
        }
        if (synthRef.current && !muted.current) {
            const now = Tone.now();
            const note = `${noteNames[noteIndex]}4`;
            synthRef.current.triggerAttack(note, now);
            synthRef.current.triggerRelease(note, now + 1);
        }
        console.log(`toneStarted and synthRef`, { toneStarted, synthRef });
    };

    const handleModInputChange = (e) => {
        const value = e.target.value;
        // Only allow numbers, commas, and spaces
        if (/^[0-9,\s]*$/.test(value)) {
            setModInput(value);
        }
    };

    const parseModInput = () => {
        return modInput
            .split(/[,\s]+/)
            .map(s => s.trim())
            .filter(s => s !== '')
            .map(s => parseInt(s))
            .filter(n => !isNaN(n));
    };

    const analyze = () => {
        let inputSet;
        if (inputMode === 'piano') {
            inputSet = Array.from(selectedNotes);
        } else {
            inputSet = parseModInput();
        }

        let resultJson = {};
        setResults({});

        if (inputSet.length > 0) {

            if (synthRef.current && !muted.current) {
                const now = Tone.now();
                inputSet.forEach((noteNum) => {
                    const note = `${noteNames[noteNum]}4`;
                    synthRef.current.triggerAttack(note, now);
                    synthRef.current.triggerRelease(note, now + 1);
                });
            }
            console.log('window.getPrimeForm',window.getPrimeForm);
            const pf = window.getPrimeForm && window.getPrimeForm(inputSet);
            console.log('pf', pf);
            if (pf) {
                setResults((prev) => ({
                    ...prev, primeForm:
                    {
                        label: 'Prime Form',
                        value: `{${normalizeSet(pf).join(',\u200B')}}`
                    }
                }));
            }
            else {
                setResults((prev) => ({
                    ...prev, primeForm:
                    {
                        label: 'Prime Form',
                        value: "ERROR: Backend logic for prime form not implemented."
                    }
                }));
            }

            const iv = window.getIntervalVector && window.getIntervalVector(inputSet);
            if (iv) {
                setResults((prev) => ({
                    ...prev, intervalVector:
                    {
                        label: 'Interval Vector',
                        value: `<${iv.join(',\u200B')}>`
                    }
                }));
            }
            else {
                setResults((prev) => ({
                    ...prev, intervalVector:
                    {
                        label: 'Interval Vector',
                        value: "ERROR: Backend logic for interval vector not implemented."
                    }
                }));
            }

            const ts = window.isTranspositionallySymmetrical && window.isTranspositionallySymmetrical(inputSet);
            if (ts) {
                setResults((prev) => ({
                    ...prev, isTranspositionallySymmetrical: {
                        label: 'Transpositionally Symmetrical',
                        value: `${ts}`
                    }
                }));
            }
            else {
                setResults((prev) => ({
                    ...prev, isTranspositionallySymmetrical: {
                        label: 'Transpositionally Symmetrical',
                        value: "ERROR: Backend logic for transpositional symmetry not implemented."
                    }
                }));
            }

            const inv = window.getInversion && window.getInversion(inputSet);
            if (inv) {
                setResults((prev) => ({
                    ...prev, inversion: {
                        label: 'Inversion',
                        value: `{${normalizeSet(inv).join(',')}}`
                    }
                }));
            }
            else {
                setResults((prev) => ({
                    ...prev, inversion: {
                        label: 'Inversion',
                        value: "ERROR: Backend logic for inversions not implemented."
                    }
                }));
            }

            const is = window.isInversionallySymmetrical && window.isInversionallySymmetrical(inputSet);
            if (is) {
                setResults((prev) => ({
                    ...prev, isInversionallySymmetrical: {
                        label: 'Inversionally Symmetrical',
                        value: `${is}`
                    }
                }));
            }
            else {
                setResults((prev) => ({
                    ...prev, isInversionallySymmetrical: {
                        label: 'Inversionally Symmetrical',
                        value: "ERROR: Backend logic for inversional symmetry not implemented."
                    }
                }));
            }

            const comp = window.getComplement && window.getComplement(inputSet);
            if (comp) {
                setResults((prev) => ({
                    ...prev, complement: {
                        label: 'Complement',
                        value: `{${normalizeSet(comp).join(',')}}`
                    }
                }));
            }
            else {
                setResults((prev) => ({
                    ...prev, complement: {
                        label: 'Complement',
                        value: "ERROR: Backend logic for complements not implemented."
                    }
                }));
            }

            const fn = window.getForteNumber && window.getForteNumber(inputSet);
            if (fn) {
                setResults((prev) => ({
                    ...prev, forteNumber: {
                        label: 'Forte Number (Rahn-Solomon Flavor)',
                        value: `${fn}`
                    }
                }));
            }
            else {
                setResults((prev) => ({
                    ...prev, getForteNumber: {
                        label: 'Forte Number (Rahn-Solomon Flavor)',
                        value: "ERROR: Backend logic for complements not implemented."
                    }
                }));
            }
        }
    };

    const normalizeSet = useCallback((set) => {
        var resultsNorm = []
        //use conventions for double digits
        for (let i = 0; i < set.length; i++) {
            console.log('adding index', i);
            if (set[i] === 10) {
                resultsNorm.push('T');
            }
            else if (set[i] === 11) {
                resultsNorm.push('E');
            }
            else {
                resultsNorm.push(set[i]);
            }
        }
        return resultsNorm;
    }, []);

    const clear = () => {
        setSelectedNotes(new Set());
        setModInput('');
        setResults(null);
    };

    const PianoKey = ({ noteIndex, isBlack = false }) => {
        const isSelected = selectedNotes.has(noteIndex);
        const baseClasses = isBlack
            ? "absolute w-8 h-16 bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-b-md transform -translate-x-1/2 z-10 shadow-lg"
            : "w-12 h-24 bg-gradient-to-b from-white to-gray-100 border-r border-gray-300 last:border-r-0";

        const selectedClasses = isSelected
            ? (isBlack ? "from-yellow-600 to-yellow-800 shadow-yellow-400/50" : "from-yellow-200 to-yellow-300 shadow-yellow-400/50")
            : "";

        const hoverClasses = "hover:shadow-lg transition-all duration-150 cursor-pointer";

        return (
            <div
                className={`${baseClasses} ${selectedClasses} ${hoverClasses} ${isSelected ? 'shadow-2xl' : ''}`}
                onClick={() => handleNoteClick(noteIndex)}
                title={noteNames[noteIndex]}
            >
                {!isBlack && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium">
                        {/* {noteNames[noteIndex]} */}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black p-6">

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Music className="w-12 h-12 text-yellow-400" />
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                            Pitch Class Set Analyzer
                        </h1>
                        <Sparkles className="w-12 h-12 text-yellow-400" />
                    </div>
                    <p className="text-yellow-200/80 text-lg font-light">
                        Discover sets using Larry Solomon's and John Rahn's conventions
                    </p>
                </div>

                {/* Input Mode Toggle */}
                {pyLoaded && (
                    <div className="flex justify-center mb-8 opacity-0 translate-y-4 animate-[fadeSlideIn_0.7s_ease-out_0.1s_forwards]">
                        <div className="relative flex bg-black/30 backdrop-blur-sm rounded-full border border-yellow-600/30 overflow-hidden">
                            {/* Sliding highlight */}
                            <div
                                className={`absolute top-0 bottom-0 w-1/2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-transform duration-300 ${inputMode === 'piano' ? 'translate-x-0' : 'translate-x-full'
                                    }`}
                            />

                            {/* Piano Option */}
                            <button
                                onClick={() => setInputMode('piano')}
                                className={`relative z-10 flex items-center gap-2 px-6 py-3 w-1/2 justify-center font-medium transition-colors duration-300 ${inputMode === 'piano' ? 'text-black' : 'text-yellow-200 hover:text-yellow-100'
                                    }`}
                            >
                                <Piano className="w-5 h-5" />
                                Piano Interface
                            </button>

                            {/* Mod 12 Option */}
                            <button
                                onClick={() => setInputMode('mod12')}
                                className={`relative z-10 flex items-center gap-2 px-6 py-3 w-1/2 justify-center font-medium transition-colors duration-300 ${inputMode === 'mod12' ? 'text-black' : 'text-yellow-200 hover:text-yellow-100'
                                    }`}
                            >
                                <Hash className="w-5 h-5" />
                                Mod 12 Input
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Section */}
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-yellow-600/20 p-8 mb-8 shadow-2xl">
                    {pyLoaded ? (
                        <div className="opacity-0 translate-y-8 animate-[fadeSlideIn_0.7s_ease-out_0.2s_forwards]">
                            {inputMode === 'piano' ? (
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl font-semibold text-yellow-300 mb-6 flex items-center gap-2">
                                        <Piano className="w-6 h-6" />
                                        Select Notes on Piano
                                    </h3>

                                    {/* Piano */}
                                    <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 shadow-2xl">
                                        <div className="flex relative">
                                            {/* White keys */}
                                            {[0, 2, 4, 5, 7, 9, 11].map((noteIndex) => (
                                                <PianoKey key={noteIndex} noteIndex={noteIndex} />
                                            ))}

                                            {/* Black keys */}
                                            {blackKeys.map((noteIndex, index) => {
                                                const positions = [36, 84, 180, 228, 276]; // Pixel positions
                                                return (
                                                    <div
                                                        key={noteIndex}
                                                        className="absolute"
                                                        style={{ left: `${positions[index]}px` }}
                                                    >
                                                        <PianoKey noteIndex={noteIndex} isBlack={true} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {selectedNotes.size > 0 && (
                                        <div className="mt-6 text-center">
                                            <p className="text-yellow-200 mb-2">Selected notes:</p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {Array.from(selectedNotes).sort((a, b) => a - b).map(note => (
                                                    <span key={note} className="bg-yellow-600/20 border border-yellow-400/30 px-3 py-1 rounded-full text-yellow-200 text-sm">
                                                        {noteNames[note]} ({note})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl font-semibold text-yellow-300 mb-6 flex items-center gap-2">
                                        <Hash className="w-6 h-6" />
                                        Enter Mod 12 Integers
                                    </h3>
                                    <div className="w-full max-w-md">
                                        <input
                                            type="text"
                                            value={modInput}
                                            onChange={handleModInputChange}
                                            placeholder="e.g., 0, 4, 7 or 0 4 7"
                                            className="w-full px-4 py-3 bg-black/40 border border-yellow-600/30 rounded-xl text-yellow-100 placeholder-yellow-300/50 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all text-center text-lg"
                                        />
                                        <p className="text-yellow-200/60 text-sm mt-2 text-center">
                                            Separate numbers with commas or spaces
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-semibold text-yellow-300 mb-6 flex items-center gap-2">
                                Loading backend scripts and logic...
                                <LoadingSpinner />
                            </h3>
                        </div>
                    )}
                </div>

                <style jsx>{`
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(var(--tw-translate-y));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={analyze}
                        disabled={inputMode === 'piano' ? selectedNotes.size === 0 : parseModInput().length === 0}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl shadow-lg hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                        <Sparkles className="w-5 h-5" />
                        Analyze
                    </button>
                    <button
                        onClick={clear}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-400/30 text-red-200 rounded-xl hover:bg-red-600/30 transition-all duration-300"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Clear
                    </button>
                </div>

                {/* Results */}
                {results && (
                    <div className="bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-sm rounded-2xl border border-yellow-600/20 p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-yellow-300 mb-6 text-center flex items-center justify-center gap-2">
                            <Music className="w-7 h-7" />
                            Analysis Results
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">

                            {Object.entries(results).map(([key, value]) =>
                            (<div
                                key={key}
                                className="bg-yellow-600/10 border border-yellow-400/20 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-yellow-200 mb-3">{value.label}</h4>
                                <p className="text-3xl font-mono text-yellow-100 text-center bg-black/20 py-3 rounded-lg">
                                    {value.value}
                                </p>
                            </div>)
                            )
                            }

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PitchClassAnalyzer;