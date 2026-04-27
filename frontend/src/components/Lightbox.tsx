import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../data/gallery';
import { useLanguage } from '../context/LanguageContext';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, currentIndex, onClose, onPrev, onNext }) => {
  const { language } = useLanguage();
  const currentItem = items[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentItem) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-deep/95 backdrop-blur-xl select-none"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white transition-colors p-2"
        aria-label="Close lightbox"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-6 z-[110] text-white/50 hover:text-white transition-colors p-4"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-6 z-[110] text-white/50 hover:text-white transition-colors p-4"
        aria-label="Next image"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      <div className="relative max-w-[90vw] max-h-[80vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <motion.div
          key={currentItem.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative group"
        >
          {currentItem.type === 'video' ? (
            <div className="aspect-video w-full max-w-4xl bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <iframe
                src={currentItem.videoUrl}
                className="w-full h-full"
                title={currentItem.alt[language]}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <img
              src={currentItem.src}
              alt={currentItem.alt[language]}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-8 text-center"
        >
          <span className="inline-block px-3 py-1 bg-brand-red text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4">
            {currentItem.category}
          </span>
          <p className="text-white text-lg font-serif italic max-w-xl mx-auto leading-relaxed">
            {currentItem.alt[language]}
          </p>
          <div className="mt-4 text-white/30 text-[10px] font-mono tracking-widest uppercase">
            {currentIndex + 1} / {items.length}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Lightbox;
