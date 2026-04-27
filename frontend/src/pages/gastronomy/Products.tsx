import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard';

const ProductsPage = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Editorial Intro */}
      <section className="bg-brand-deep pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1589531610484-98ae0327f27e?auto=format&fit=crop&q=80&w=800"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-brand-sage text-xs font-bold uppercase tracking-[0.3em] mb-6">
              {t('nav.gastronomy')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 italic leading-tight">
              {t('nav.flagship')}
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic">
              {language === 'fr' 
                ? "Le Cap Bon est une terre de synthèse, une « shakshouka » de saveurs où les continents se rencontrent. Notre identité gastronomique s'est forgée à travers des millénaires d'échanges, donnant naissance à des produits d'une intensité rare."
                : "Cap Bon is a land of synthesis, a 'shakshouka' of flavors where continents meet. Our gastronomic identity has been forged through millennia of exchange, giving birth to products of rare intensity."
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding container-custom px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Closing Note */}
        <div className="mt-32 p-12 bg-white rounded-3xl border border-brand-forest/10 text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl md:text-3xl font-serif italic text-brand-deep mb-6">
            {language === 'fr' 
              ? "Un héritage à préserver, une saveur à partager."
              : "A heritage to preserve, a flavor to share."
            }
          </h2>
          <p className="text-brand-deep/60 leading-relaxed max-w-2xl mx-auto italic">
            {language === 'fr'
              ? "Tous nos produits phares sont le fruit d'un savoir-faire artisanal transmis de génération en génération. En soutenant le Cap Bon 2028, vous contribuez à la pérennité de ce patrimoine mondial."
              : "All our flagship products are the fruit of artisanal expertise passed down from generation to generation. By supporting Cap Bon 2028, you contribute to the sustainability of this world heritage."}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
