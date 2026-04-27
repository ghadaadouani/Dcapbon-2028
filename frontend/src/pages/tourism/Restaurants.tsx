import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Restaurants = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-brand-deep pt-32 pb-24 px-6 relative overflow-hidden text-white">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block text-brand-sage text-xs font-bold uppercase tracking-[0.3em] mb-6 font-sans">
              {t('nav.tourism')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 leading-tight">
              {t('diningPage.title')}
            </h1>
            
            <div className="flex flex-col gap-2 mb-10">
              <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('diningPage.subtitle1')}
              </span>
              <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('diningPage.subtitle2')}
              </span>
            </div>

            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic max-w-3xl">
              {t('diningPage.body1')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Concept Sections */}
      <section className="section-padding container-custom px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="prose prose-brand-deep text-brand-deep/80 text-lg md:text-xl leading-relaxed font-sans max-w-none">
              <p className="mb-12">
                {t('diningPage.body2')}
              </p>
            </div>

            {/* Content Cards */}
            <div className="space-y-8 mt-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl border border-brand-forest/10 shadow-sm"
              >
                <h3 className="text-brand-deep font-serif italic text-2xl mb-4">{t('diningPage.concept1Title')}</h3>
                <p className="text-brand-deep/70 text-base leading-relaxed">
                  {t('diningPage.concept1Desc')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-brand-forest/5 p-10 rounded-3xl border border-brand-forest/10 shadow-sm"
              >
                <h3 className="text-brand-deep font-serif italic text-2xl mb-4">{t('diningPage.concept2Title')}</h3>
                <p className="text-brand-deep/70 text-base leading-relaxed">
                  {t('diningPage.concept2Desc')}
                </p>
              </motion.div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-16">
              <Link to="/contact" className="btn btn-primary">
                {t('diningPage.ctaReserve')}
              </Link>
              <Link to="/la-region/partners" className="btn btn-outline">
                {t('diningPage.ctaProducers')}
              </Link>
            </div>
          </motion.div>

          {/* Image Placeholders */}
          <div className="flex flex-col gap-12 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-square bg-brand-sage/10 rounded-3xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base md:text-lg">
                    {t('diningPage.img1Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Courtyard Interiority
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-[4/5] bg-brand-forest/10 rounded-3xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base md:text-lg text-[#546B41]">
                    {t('diningPage.img2Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Direct Supply Chain
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Restaurants;
