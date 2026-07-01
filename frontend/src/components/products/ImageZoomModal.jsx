import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Full-screen zoomed product image viewer.
 */
const ImageZoomModal = ({ product, onClose }) => {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button onClick={onClose} className="absolute top-5 right-5 text-white/80 hover:text-white">
            <X size={28} />
          </button>
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            src={product.imageURL}
            alt={product.name}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-8 text-white/90 font-medium">{product.name}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageZoomModal;
