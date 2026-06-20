export function MissingCount({ totalDrawn }: { totalDrawn: number }) {
  const missing = 75 - totalDrawn;
  return (
    <div className="flex flex-col items-center justify-center glass p-4 md:p-8 lg:p-12 rounded-3xl min-w-[200px] md:min-w-[300px] lg:min-w-[400px] shadow-[0_10px_25px_rgba(0,0,0,0.15)] dark:shadow-2xl">
      <h2 className="text-xl md:text-3xl lg:text-5xl font-black text-foreground/80 uppercase tracking-wider mb-2 md:mb-4 drop-shadow-sm">Faltam:</h2>
      <span className="text-7xl md:text-8xl lg:text-[10rem] font-black text-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] leading-none">{missing}</span>
    </div>
  );
}
