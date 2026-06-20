import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface PlayerState {
  id: string;
  name: string;
  card: number[][];
  marked: string[];
}

interface PlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Record<string, PlayerState>;
  drawnNumbers: number[];
}

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];

export function PlayersModal({ isOpen, onClose, players, drawnNumbers }: PlayersModalProps) {
  const playersList = Object.values(players);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[90vh] p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col relative border border-foreground/10 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/10 transition-colors z-10"
            >
              <X size={32} className="text-foreground/50 hover:text-foreground" />
            </button>
            
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-2">Cartelas em Jogo</h2>
            <p className="text-foreground/60 mb-6 font-medium text-lg">Jogadores Conectados: {playersList.length}</p>

            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {playersList.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center h-64 text-foreground/40">
                  <span className="text-xl font-bold">Nenhum jogador conectado no momento.</span>
                  <span className="text-sm">Peça para escanearem o QR Code!</span>
                </div>
              ) : (
                playersList.map((player) => {
                  // Calcular progresso do jogador (quantos marcados estão corretos de fato)
                  const validMarks = player.marked.filter(pos => {
                    const [c, r] = pos.split('-').map(Number);
                    const num = player.card[c][r];
                    return num === 0 || drawnNumbers.includes(num); // 0 é o centro Livre
                  });

                  return (
                    <div key={player.id} className="bg-slate-50 dark:bg-background/50 border border-foreground/10 rounded-2xl p-4 shadow-sm flex flex-col relative">
                      <h3 className="text-xl font-bold mb-3 flex items-center justify-between">
                        <span>{player.name}</span>
                        <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-md">
                          {validMarks.length}/24
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-5 gap-1 w-full bg-white dark:bg-slate-950 p-2 rounded-xl shadow-inner border border-foreground/5">
                        {/* Header Letters */}
                        {BINGO_LETTERS.map(l => (
                          <div key={`h-${l}`} className="text-center font-black text-sm text-foreground/50 pb-1">{l}</div>
                        ))}
                        
                        {/* Rows - we have card[col][row] */}
                        {Array.from({ length: 5 }).map((_, rIdx) => (
                          Array.from({ length: 5 }).map((_, cIdx) => {
                            const num = player.card[cIdx][rIdx];
                            const isMarked = player.marked.includes(`${cIdx}-${rIdx}`);
                            const isFree = num === 0;
                            const isDrawn = isFree || drawnNumbers.includes(num);
                            
                            // Se o jogador marcou mas não foi sorteado, vamos mostrar vermelho
                            const isError = isMarked && !isDrawn;
                            
                            return (
                              <div
                                key={`${cIdx}-${rIdx}`}
                                className={cn(
                                  "aspect-square rounded flex items-center justify-center text-xs md:text-sm font-bold border transition-colors",
                                  isMarked && isDrawn ? "bg-green-500 border-green-400 text-white" : "",
                                  isError ? "bg-red-500 border-red-400 text-white" : "",
                                  !isMarked && isDrawn ? "bg-yellow-200 border-yellow-300 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500 dark:border-yellow-700/50" : "",
                                  !isMarked && !isDrawn ? "bg-background border-foreground/5 text-foreground/70" : ""
                                )}
                                title={isFree ? "Livre" : String(num)}
                              >
                                {isFree ? "★" : num}
                              </div>
                            );
                          })
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
