import { Sun, Moon, Monitor, RefreshCw, Dices, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ControlsProps {
  onDraw: () => void;
  onReset: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  allDrawn: boolean;
  isDrawing: boolean;
  onFullscreen: () => void;
}

export function Controls({ onDraw, onReset, theme, setTheme, allDrawn, isDrawing, onFullscreen }: ControlsProps) {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-4 z-50">
      <div className="flex gap-2 p-2 glass rounded-full shadow-lg">
        <button onClick={() => setTheme('light')} className={cn("p-3 rounded-full transition-colors", theme === 'light' ? 'bg-foreground/10' : 'hover:bg-foreground/5')}>
          <Sun size={24} className={theme === 'light' ? 'text-yellow-500' : 'text-foreground/70'} />
        </button>
        <button onClick={() => setTheme('dark')} className={cn("p-3 rounded-full transition-colors", theme === 'dark' ? 'bg-foreground/10' : 'hover:bg-foreground/5')}>
          <Moon size={24} className={theme === 'dark' ? 'text-blue-500' : 'text-foreground/70'} />
        </button>
        <button onClick={() => setTheme('black')} className={cn("p-3 rounded-full transition-colors", theme === 'black' ? 'bg-foreground/10' : 'hover:bg-foreground/5')} title="Tema Preto">
          <Monitor size={24} className={theme === 'black' ? 'text-gray-400' : 'text-foreground/70'} />
        </button>
        <div className="w-[1px] bg-foreground/20 mx-1"></div>
        <button onClick={onFullscreen} className="p-3 rounded-full transition-colors hover:bg-foreground/5" title="Tela Cheia">
          <Maximize size={24} className="text-foreground/70" />
        </button>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDraw}
        disabled={allDrawn || isDrawing}
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/50"
      >
        <Dices size={28} />
        Sortear Número
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-xl font-bold text-lg border border-red-500/50"
      >
        <RefreshCw size={24} />
        Resetar Painel
      </motion.button>
    </div>
  );
}
