import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { usePageContent } from '../../hooks/usePageContent';
import ProductCard from '../../components/ProductCard';
import FAQ from '../../components/FAQ';

const ProductsPage = () => {
  const { language, t } = useLanguage();
  const { content: dynamicContent } = usePageContent('artisanal-crafts', null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-brand-cream min-h-screen">
      <section className="bg-brand-deep pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1589531610484-98ae0327f27e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <span className="inline-block text-brand-sage text-xs font-bold uppercase tracking-[0.3em] mb-6">{t('nav.gastronomy')}</span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 leading-tight">{t('nav.flagship')}</h1>
            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic">
              {language === 'fr'
                ? "Le Cap Bon est une terre de synthèse, une « shakshouka » de saveurs où les continents se rencontrent."
                : "Cap Bon is a land of synthesis, a 'shakshouka' of flavors where continents meet."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding container-custom px-6">
        {loading ? (
          <div className="text-center py-20 text-brand-deep/30 italic">
            {language === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-brand-deep/30 italic">
            {language === 'fr' ? 'Aucun produit disponible.' : 'No products available yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        <div className="mt-32 p-12 bg-white rounded-3xl border border-brand-forest/10 text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl md:text-3xl font-serif italic text-brand-deep mb-6">
            {language === 'fr' ? "Un héritage à préserver, une saveur à partager." : "A heritage to preserve, a flavor to share."}
          </h2>
          <p className="text-brand-deep/60 leading-relaxed max-w-2xl mx-auto italic">
            {language === 'fr'
              ? "Tous nos produits phares sont le fruit d'un savoir-faire artisanal transmis de génération en génération."
              : "All our flagship products are the fruit of artisanal expertise passed down from generation to generation."}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ data={dynamicContent} />
    </div>
  );
};

export default ProductsPage;
