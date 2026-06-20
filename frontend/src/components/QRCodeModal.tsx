import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[9999] p-4 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 md:p-16 lg:p-20 rounded-[3rem] shadow-2xl flex flex-col items-center relative max-w-[95vw] max-h-[95vh]"
          >
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-900 mb-6 md:mb-12 text-center drop-shadow-sm">Jogue Pelo Celular!</h2>
            <div className="bg-gray-100 p-4 md:p-8 lg:p-12 rounded-3xl shadow-inner">
              <QRCodeSVG value={url} size={800} level="H" includeMargin={true} className="w-[70vw] h-[70vw] md:w-[50vh] md:h-[50vh] lg:w-[60vh] lg:h-[60vh]" />
            </div>
            <p className="mt-8 md:mt-12 text-2xl md:text-4xl lg:text-5xl text-gray-700 font-bold text-center">
              Aponte a câmera do celular para pegar sua cartela
            </p>
            <p className="mt-4 md:mt-6 text-xl md:text-2xl lg:text-3xl text-gray-500 font-medium text-center max-w-2xl lg:max-w-4xl">
              Você jogará direto do celular. A cartela é offline, não esqueça de gritar BINGO!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
