import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];

const LETTER_COLORS: Record<string, string> = {
  B: 'border-blue-500 text-blue-500 bg-blue-500',
  I: 'border-red-500 text-red-500 bg-red-500',
  N: 'border-yellow-500 text-yellow-500 bg-yellow-500',
  G: 'border-green-500 text-green-500 bg-green-500',
  O: 'border-purple-500 text-purple-500 bg-purple-500',
};

interface BingoBoardProps {
  drawnNumbers: number[];
  onToggleNumber: (num: number) => void;
}

export function getLetter(val: number) {
  const index = Math.floor((val - 1) / 15);
  return BINGO_LETTERS[index] || '';
}

export function BingoBoard({ drawnNumbers, onToggleNumber }: BingoBoardProps) {
  return (
    <div className="flex flex-col gap-2 w-full mx-auto p-2 md:p-4 glass rounded-2xl shadow-xl">
      {BINGO_LETTERS.map((letter, i) => {
        const start = i * 15 + 1;
        const numbers = Array.from({ length: 15 }, (_, idx) => start + idx);
        
        return (
          <div key={letter} className="flex flex-nowrap items-center gap-1 md:gap-2 w-full pb-1">
            <div className="text-2xl md:text-5xl font-bold w-10 md:w-16 shrink-0 text-center text-foreground border-r-2 border-foreground/10 py-1">
              {letter}
            </div>
            {numbers.map(num => {
              const isDrawn = drawnNumbers.includes(num);
              const colorClasses = LETTER_COLORS[letter].split(' ');
              const borderColor = colorClasses[0];
              const textColor = colorClasses[1];
              const bgColor = colorClasses[2];
              
              return (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggleNumber(num)}
                  className={cn(
                    "flex-1 aspect-square max-w-[5rem] max-h-[5rem] min-w-[1.5rem] min-h-[1.5rem] flex items-center justify-center rounded-md md:rounded-lg border-2 text-sm sm:text-xl md:text-3xl font-bold transition-all duration-300 shadow-sm",
                    isDrawn ? cn(bgColor, "text-white border-transparent shadow-lg scale-105") : cn("bg-background hover:bg-foreground/5", borderColor, textColor)
                  )}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
