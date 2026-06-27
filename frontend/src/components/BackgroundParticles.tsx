import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BackgroundParticles() {
  const [particles] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 80 + 20,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 30 + 30,
    targetX: Math.random() * 100 - 50,
  })));

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 dark:from-background dark:via-background dark:to-foreground/5" />
      {particles.map((p) => (
        <motion.div
           key={p.id}
           className="absolute rounded-full bg-blue-500/20 dark:bg-foreground/10 blur-xl mix-blend-multiply dark:mix-blend-screen"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: -150,
          }}
          animate={{
            y: [0, -window.innerHeight - 300],
            x: [0, p.targetX],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
