import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLetter } from './BingoBoard';

interface NumberOverlayProps {
  drawnNumber: number | null;
  isDrawing: boolean;
  onComplete: () => void;
}

export function NumberOverlay({ drawnNumber, isDrawing, onComplete }: NumberOverlayProps) {
  useEffect(() => {
    if (drawnNumber !== null && !isDrawing) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [drawnNumber, isDrawing, onComplete]);

  return (
    <AnimatePresence>
      {drawnNumber !== null && (
        <OverlayContent drawnNumber={drawnNumber} isDrawing={isDrawing} onComplete={onComplete} />
      )}
    </AnimatePresence>
  );
}

function OverlayContent({ drawnNumber, isDrawing, onComplete }: { drawnNumber: number, isDrawing: boolean, onComplete: () => void }) {
  const [displayNum, setDisplayNum] = useState(drawnNumber);

  useEffect(() => {
    if (!isDrawing) {
      setDisplayNum(drawnNumber);
      return;
    }
    
    // Efeito de roleta rápida
    const interval = setInterval(() => {
      setDisplayNum(Math.floor(Math.random() * 75) + 1);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isDrawing, drawnNumber]);

  const letter = getLetter(displayNum);
  const getColor = (l: string) => {
    switch (l) {
      case 'B': return '#3b82f6';
      case 'I': return '#ef4444';
      case 'N': return '#eab308';
      case 'G': return '#22c55e';
      case 'O': return '#a855f7';
      default: return '#6b7280';
    }
  };
  const color = getColor(letter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.3, y: 100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.3, y: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        style={{ borderColor: color, color: color }}
        className="w-[90vw] h-[90vw] md:w-[85vh] md:h-[85vh] rounded-full bg-white border-[16px] md:border-[32px] flex flex-col items-center justify-center shadow-[0_0_150px_rgba(255,255,255,0.8)]"
      >
        <span className="text-7xl md:text-[8rem] lg:text-[10rem] font-bold mb-[-20px] md:mb-[-40px] drop-shadow-sm">{letter}</span>
        <span className="text-[14rem] md:text-[26rem] lg:text-[35rem] font-black leading-none drop-shadow-xl">{displayNum}</span>
      </motion.div>
    </motion.div>
  );
}
