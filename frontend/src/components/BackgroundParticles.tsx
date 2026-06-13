import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BackgroundParticles() {
  const [particles, setParticles] = useState<{ id: number; size: number; x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 20,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 30 + 30,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-foreground/5" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-foreground/10 blur-xl mix-blend-screen dark:mix-blend-lighten"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: -150,
          }}
          animate={{
            y: [0, -window.innerHeight - 300],
            x: [0, Math.random() * 100 - 50],
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
