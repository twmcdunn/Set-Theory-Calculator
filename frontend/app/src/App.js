import logo from './logo.svg';
import './App.css';
import PitchClassAnalyzer from './Components/PitchClassAnalyzer';
import FloatingSetsLayer from "./Components/FloatingSetsLayer";
import SetTheoryBackground from './SetTheoryBackground';
import { useEffect } from 'react';
import { useState } from 'react';
function App() {
  const [pyLoaded, setPyLoaded] = useState(false);
  useEffect(() => {
    document.addEventListener('py:ready', () => {
      console.log('PyScript ready event fired');
      setPyLoaded(true);
    });
  }, []);
  return (
    <div className="App">

      <SetTheoryBackground />
      {/* actual app content (z-10 keeps it above background) */}
      <main className="relative z-10">
        <div className="app-container">
          <PitchClassAnalyzer
            pyLoaded={pyLoaded} />
        </div>
      </main>
    </div>
  );
}

export default App;
