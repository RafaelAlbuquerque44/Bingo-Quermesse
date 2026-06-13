import { getLetter } from './BingoBoard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LastBallsProps {
  drawnNumbers: number[];
}

export function LastBalls({ drawnNumbers }: LastBallsProps) {
  const lastFive = [...drawnNumbers].reverse().slice(0, 5);
  
  const current = lastFive[0];
  const previous = lastFive.slice(1, 5).reverse();
  
  // pad to 4 elements always
  while(previous.length < 4) {
    previous.unshift(null as any);
  }

  const getColor = (num: number) => {
    const letter = getLetter(num);
    switch (letter) {
      case 'B': return 'bg-blue-500';
      case 'I': return 'bg-red-500';
      case 'N': return 'bg-yellow-500';
      case 'G': return 'bg-green-500';
      case 'O': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 glass rounded-2xl shadow-xl w-full max-w-xl border-t-4 border-t-green-500">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground/80">Últimos Números Chamados</h3>
      <div className="flex items-center justify-center gap-4 w-full">
        {previous.map((num, i) => (
          <div 
            key={`prev-${i}-${num || 'empty'}`}
            className={cn(
              "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-white shadow-inner transition-colors duration-500",
              num ? cn(getColor(num), "opacity-80") : "bg-foreground/20 text-transparent opacity-60"
            )}
          >
            {num || '--'}
          </div>
        ))}
        
        <AnimatePresence mode="popLayout">
          {current ? (
            <motion.div
              key={current}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={cn(
                "w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-2xl z-10 ml-4 border-4 border-white/20",
                getColor(current)
              )}
            >
              {current}
            </motion.div>
          ) : (
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-5xl md:text-6xl font-bold text-white/50 bg-foreground/20 shadow-inner ml-4">
              --
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
