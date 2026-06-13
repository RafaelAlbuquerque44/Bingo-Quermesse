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
    <div className="flex flex-col items-center justify-center p-6 lg:p-10 glass rounded-2xl shadow-xl w-full max-w-4xl border-t-8 border-t-green-500">
      <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6 lg:mb-10 text-foreground/80">Últimos Números Chamados</h3>
      <div className="flex items-center justify-center gap-4 lg:gap-8 w-full">
        {previous.map((num, i) => (
          <div 
            key={`prev-${i}-${num || 'empty'}`}
            className={cn(
              "w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center text-3xl md:text-4xl lg:text-6xl font-bold text-white shadow-inner transition-colors duration-500",
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
                "w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full flex items-center justify-center text-7xl md:text-8xl lg:text-9xl font-bold text-white shadow-2xl z-10 lg:ml-8 border-8 border-white/20",
                getColor(current)
              )}
            >
              {current}
            </motion.div>
          ) : (
            <div className="w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full flex items-center justify-center text-7xl md:text-8xl lg:text-9xl font-bold text-white/50 bg-foreground/20 shadow-inner lg:ml-8">
              --
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
