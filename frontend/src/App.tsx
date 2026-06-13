import { useState, useEffect } from 'react';
import { BingoBoard } from './components/BingoBoard';
import { LastBalls } from './components/LastBalls';
import { MissingCount } from './components/MissingCount';
import { Controls } from './components/Controls';
import { NumberOverlay } from './components/NumberOverlay';

function App() {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [theme, setTheme] = useState<string>('light');
  const [overlayNumber, setOverlayNumber] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('bingo-theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'black');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--background', '222.2 84% 4.9%');
    } else if (theme === 'black') {
      root.classList.add('dark', 'black');
      root.style.setProperty('--background', '0 0% 0%'); // Absolute black
    } else {
      root.classList.add('light');
      root.style.setProperty('--background', '0 0% 100%');
    }
    
    localStorage.setItem('bingo-theme', theme);
  }, [theme]);

  const toggleNumber = (num: number) => {
    if (drawnNumbers.includes(num)) {
      setDrawnNumbers(prev => prev.filter(n => n !== num));
    } else {
      setDrawnNumbers(prev => [...prev, num]);
      setOverlayNumber(num);
    }
  };

  const drawNumber = () => {
    if (drawnNumbers.length >= 75) return;
    
    const available = Array.from({ length: 75 }, (_, i) => i + 1).filter(n => !drawnNumbers.includes(n));
    const randomIdx = Math.floor(Math.random() * available.length);
    const num = available[randomIdx];
    
    setDrawnNumbers(prev => [...prev, num]);
    setOverlayNumber(num);
  };

  const resetBoard = () => {
    if (confirm('Tem certeza que deseja RESETAR o painel de bingo? Todos os números serão desmarcados.')) {
      setDrawnNumbers([]);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 pb-20 pt-10 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 mb-8 items-stretch justify-center">
        <LastBalls drawnNumbers={drawnNumbers} />
        <MissingCount totalDrawn={drawnNumbers.length} />
      </div>
      
      <BingoBoard drawnNumbers={drawnNumbers} onToggleNumber={toggleNumber} />
      
      <Controls 
        onDraw={drawNumber} 
        onReset={resetBoard} 
        theme={theme} 
        setTheme={setTheme} 
        allDrawn={drawnNumbers.length >= 75}
      />
      
      <NumberOverlay drawnNumber={overlayNumber} onComplete={() => setOverlayNumber(null)} />
    </div>
  );
}

export default App;
