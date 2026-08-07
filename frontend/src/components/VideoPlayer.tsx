import { useState, useRef } from 'react';
import { Film } from 'lucide-react';

export function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 h-[70vh]">
      {videoSrc ? (
        <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl glass">
          <video 
            src={videoSrc} 
            controls 
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => setVideoSrc(null)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            Trocar Vídeo
          </button>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer flex flex-col items-center justify-center p-12 glass rounded-3xl border-2 border-dashed border-foreground/20 hover:border-foreground/50 transition-colors max-w-lg w-full text-center"
        >
          <Film size={64} className="mb-4 text-foreground/50" />
          <h3 className="text-2xl font-bold mb-2">Adicionar Vídeo</h3>
          <p className="text-foreground/70">Clique aqui para selecionar um vídeo do seu computador para ser exibido antes do bingo começar.</p>
          <input 
            ref={inputRef}
            type="file" 
            accept="video/*" 
            className="hidden" 
            onChange={handleVideoUpload} 
          />
        </div>
      )}
    </div>
  );
}
