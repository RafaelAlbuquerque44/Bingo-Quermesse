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
            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center relative"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 md:mb-10 text-center">Jogue Pelo Celular!</h2>
            <div className="bg-gray-100 p-4 md:p-8 rounded-2xl">
              <QRCodeSVG value={url} size={300} level="H" includeMargin={true} className="w-64 h-64 md:w-96 md:h-96" />
            </div>
            <p className="mt-8 text-xl md:text-3xl text-gray-600 font-medium text-center">
              Aponte a câmera do celular para pegar sua cartela
            </p>
            <p className="mt-4 text-lg md:text-xl text-gray-400 font-medium text-center max-w-lg">
              Você jogará direto do celular. A cartela é offline, não esqueça de gritar BINGO!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
