import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <motion.div
        layoutId={`product-${product.id}`}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group bg-brand-cream border border-brand-forest/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name[language]}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                {product.badge}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-brand-deep/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="bg-white text-brand-deep px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl">
              {language === 'fr' ? 'Découvrir' : 'Explore'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-brand-deep text-xl font-serif font-medium mb-2 group-hover:text-brand-red transition-colors">
            {product.name[language]}
          </h3>
          <p className="text-brand-deep/70 text-sm line-clamp-2 leading-relaxed">
            {product.description[language]}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-brand-deep/90 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              layoutId={`product-${product.id}`}
              className="bg-brand-cream w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-brand-red transition-colors shadow-2xl backdrop-blur-md border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name[language]}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[70vh] md:max-h-auto">
                <div className="flex items-center gap-2 text-brand-red uppercase tracking-widest text-[10px] font-bold mb-4">
                  <div className="w-8 h-[1px] bg-brand-red" />
                  <span>{product.badge || (language === 'fr' ? 'Produit Phare' : 'Flagship Product')}</span>
                </div>

                <h2 className="text-brand-deep text-3xl md:text-5xl font-serif font-medium mb-6 italic leading-tight">
                  {product.name[language]}
                </h2>

                <div className="prose prose-brand-deep mb-8 opacity-80">
                  <p className="text-lg leading-relaxed text-brand-deep/70">
                    {product.longDescription[language]}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
