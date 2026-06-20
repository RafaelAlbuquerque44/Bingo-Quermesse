import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { BackgroundParticles } from './BackgroundParticles';
import { Sun, Moon } from 'lucide-react';
import Peer, { type DataConnection } from 'peerjs';

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];

const generateCard = () => {
  const card: number[][] = [[], [], [], [], []];
  const ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];

  for (let c = 0; c < 5; c++) {
    const min = ranges[c][0];
    const max = ranges[c][1];
    const columnNumbers = new Set<number>();
    const count = c === 2 ? 4 : 5; // Coluna N tem espaço livre

    while (columnNumbers.size < count) {
      columnNumbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    card[c] = Array.from(columnNumbers).sort((a, b) => a - b);
    
    // Insere o espaço livre no meio da coluna N
    if (c === 2) {
      card[c].splice(2, 0, 0); // 0 representa LIVRE
    }
  }
  return card;
};

interface PlayerCardProps {
  theme: string;
  setTheme: (t: string) => void;
}

export function PlayerCard({ theme, setTheme }: PlayerCardProps) {
  const [card] = useState<number[][]>(() => generateCard());
  const [marked, setMarked] = useState<Set<string>>(new Set(['2-2']));
  const [playerName] = useState(() => `Jogador ${Math.floor(Math.random() * 1000)}`);
  
  const connRef = useRef<DataConnection | null>(null);

  useEffect(() => {
    const hostId = new URLSearchParams(window.location.search).get('host');
    if (!hostId) return;

    const peer = new Peer();
    
    peer.on('open', () => {
      console.log('Connecting to host:', hostId);
      const conn = peer.connect(hostId);
      connRef.current = conn;
      
      conn.on('open', () => {
        console.log('Connected! Sending init card.');
        conn.send({
          type: 'init',
          name: playerName,
          card: card,
          marked: ['2-2']
        });
      });
    });

    return () => {
      peer.destroy();
    };
  }, [playerName, card]);

  const toggleMark = (c: number, r: number) => {
    if (c === 2 && r === 2) return; // Não desmarca o Livre
    const key = `${c}-${r}`;
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      
      // Envia notificação pro painel principal
      if (connRef.current && connRef.current.open) {
        connRef.current.send({
          type: 'update',
          name: playerName,
          card: card,
          marked: Array.from(next)
        });
      }
      
      return next;
    });
  };

  const getLetterColor = (l: string) => {
    switch (l) {
      case 'B': return 'text-blue-500';
      case 'I': return 'text-red-500';
      case 'N': return 'text-yellow-500';
      case 'G': return 'text-green-500';
      case 'O': return 'text-purple-500';
      default: return 'text-foreground';
    }
  };

  if (card.length === 0) return null;

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background flex flex-col items-center justify-center p-2 sm:p-4 relative z-0">
      <BackgroundParticles />
      <div className="glass p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md md:max-w-xl">
        <h1 className="text-5xl md:text-6xl font-black text-center text-foreground mb-8 uppercase tracking-widest drop-shadow-sm">
          Bingo
        </h1>
        
        <div className="flex w-full justify-between mb-4">
           {BINGO_LETTERS.map(l => (
             <div key={l} className={cn("flex-1 text-center text-4xl md:text-5xl font-black drop-shadow-sm", getLetterColor(l))}>{l}</div>
           ))}
        </div>

        <div className="flex w-full justify-between gap-2 sm:gap-3">
          {card.map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col gap-2 sm:gap-3 flex-1">
              {col.map((num, rIdx) => {
                const isMarked = marked.has(`${cIdx}-${rIdx}`);
                const isFree = num === 0;
                
                return (
                  <button
                    key={rIdx}
                    onClick={() => toggleMark(cIdx, rIdx)}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold transition-all shadow-sm border-[3px]",
                      isMarked 
                        ? "bg-green-500 border-green-400 text-white shadow-inner scale-95" 
                        : "bg-background border-foreground/10 text-foreground hover:bg-foreground/5",
                      isFree && "bg-yellow-500 border-yellow-400 text-white text-base sm:text-xl break-words uppercase tracking-tighter leading-none p-1"
                    )}
                  >
                    {isFree ? "Livre" : num}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="mt-10 mb-2 text-center text-foreground/50 text-base md:text-lg font-medium">
          Bateu? Grite bem alto BINGO!
        </div>
      </div>

      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 p-3 glass rounded-full shadow-lg border-[2px] border-foreground/10 transition-all hover:scale-110 active:scale-95 z-50"
        title="Alternar Tema"
      >
        {theme === 'dark' ? <Sun size={28} className="text-yellow-500 drop-shadow-md" /> : <Moon size={28} className="text-blue-600 drop-shadow-md" />}
      </button>
    </div>
  );
}
