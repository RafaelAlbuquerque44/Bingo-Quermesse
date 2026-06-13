
export function MissingCount({ totalDrawn }: { totalDrawn: number }) {
  const missing = 75 - totalDrawn;
  return (
    <div className="flex flex-col items-center justify-center p-6 glass rounded-2xl shadow-xl border-t-4 border-t-red-500 min-w-[200px]">
      <h2 className="text-xl md:text-2xl text-red-500 font-bold mb-2">Faltam:</h2>
      <span className="text-6xl md:text-7xl font-black text-red-500 drop-shadow-sm">{missing}</span>
    </div>
  );
}
