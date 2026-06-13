
export function MissingCount({ totalDrawn }: { totalDrawn: number }) {
  const missing = 75 - totalDrawn;
  return (
    <div className="flex flex-col items-center justify-center p-6 lg:p-10 glass rounded-2xl shadow-xl border-t-8 border-t-red-500 min-w-[250px] lg:min-w-[400px]">
      <h2 className="text-2xl md:text-3xl lg:text-5xl text-red-500 font-bold mb-4">Faltam:</h2>
      <span className="text-7xl md:text-8xl lg:text-[10rem] font-black text-red-500 drop-shadow-md">{missing}</span>
    </div>
  );
}
