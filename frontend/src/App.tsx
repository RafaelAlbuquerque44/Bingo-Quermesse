import { useState, useEffect } from 'react';
import { BingoBoard } from './components/BingoBoard';
import { LastBalls } from './components/LastBalls';
import { MissingCount } from './components/MissingCount';
import { Controls } from './components/Controls';
import { NumberOverlay } from './components/NumberOverlay';
import { BackgroundParticles } from './components/BackgroundParticles';
import { PlayerCard } from './components/PlayerCard';
import { QRCodeModal } from './components/QRCodeModal';
import { PlayersModal, type PlayerState } from './components/PlayersModal';
import Peer from 'peerjs';

const isPlayerCard = new URLSearchParams(window.location.search).get('cartela') === 'true';

function App() {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('bingo-theme') || 'dark');
  const [isDrawing, setIsDrawing] = useState(false);
  const [overlayNumber, setOverlayNumber] = useState<number | null>(null);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isPlayersOpen, setIsPlayersOpen] = useState(false);
  
  const [hostId, setHostId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<string, PlayerState>>({});

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'black');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'black') {
      root.classList.add('dark', 'black');
    } else {
      root.classList.add('light');
    }
    
    localStorage.setItem('bingo-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isPlayerCard) return;

    const peer = new Peer();
    
    peer.on('open', (id) => {
      console.log('Host pronto. ID da Sessão:', id);
      setHostId(id);
    });

    peer.on('connection', (conn) => {
      conn.on('data', (data: unknown) => {
        const payload = data as { type: string; name: string; card: number[][]; marked: string[] };
        if (payload.type === 'init' || payload.type === 'update') {
          setPlayers(prev => ({
            ...prev,
            [conn.peer]: {
              id: conn.peer,
              name: payload.name,
              card: payload.card,
              marked: payload.marked
            }
          }));
        }
      });
      
      conn.on('close', () => {
         setPlayers(prev => {
           const next = { ...prev };
           delete next[conn.peer];
           return next;
         });
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const toggleNumber = (num: number) => {
    if (drawnNumbers.includes(num)) {
      // Se já foi sorteado, apenas remove
      setDrawnNumbers(prev => prev.filter(n => n !== num));
    } else {
      // Se não foi sorteado, mostra a tela grande (sem suspense) e adiciona
      setOverlayNumber(num);
      setDrawnNumbers(prev => [...prev, num]);
    }
  };

  const drawNumber = () => {
    if (drawnNumbers.length >= 75 || isDrawing) return;
    
    setIsDrawing(true);

    const available = Array.from({ length: 75 }, (_, i) => i + 1).filter(n => !drawnNumbers.includes(n));
    const randomIdx = Math.floor(Math.random() * available.length);
    const num = available[randomIdx];
    
    setOverlayNumber(num);

    setTimeout(() => {
      setDrawnNumbers(prev => [...prev, num]);
      setIsDrawing(false);
    }, 2000);
  };

  const resetBoard = () => {
    if (confirm('Tem certeza que deseja RESETAR o painel de bingo? Todos os números serão desmarcados.')) {
      setDrawnNumbers([]);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (isPlayerCard) {
    return <PlayerCard theme={theme} setTheme={setTheme} />;
  }

  return (
    <div className="min-h-screen transition-colors duration-500 pb-20 pt-4 px-2 md:px-4 flex flex-col items-center w-full relative z-0">
      <BackgroundParticles />
      <QRCodeModal 
        isOpen={isQROpen} 
        onClose={() => setIsQROpen(false)} 
        // Usa o caminho atual do navegador (funciona tanto local quanto no Github Pages)
        url={`${window.location.origin}${window.location.pathname}?cartela=true${hostId ? `&host=${hostId}` : ''}`} 
      />
      <PlayersModal
        isOpen={isPlayersOpen}
        onClose={() => setIsPlayersOpen(false)}
        players={players}
        drawnNumbers={drawnNumbers}
      />
      
      <div className="w-full flex flex-col md:flex-row gap-4 mb-4 items-stretch justify-center">
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
        isDrawing={isDrawing}
        onFullscreen={toggleFullscreen}
        onOpenQR={() => setIsQROpen(true)}
        onOpenPlayers={() => setIsPlayersOpen(true)}
      />
      
      <NumberOverlay drawnNumber={overlayNumber} isDrawing={isDrawing} onComplete={() => setOverlayNumber(null)} />
    </div>
  );
}

export default App;
