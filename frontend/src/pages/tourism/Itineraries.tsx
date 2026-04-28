import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { usePageContent } from '../../hooks/usePageContent';
import FAQ from '../../components/FAQ';

const Itineraries = () => {
  const { language, t } = useLanguage();
  const { content: dynamicContent } = usePageContent('itineraries', null);

  const experiences = [
    { title: t('itinerariesPage.ex1Title'), desc: t('itinerariesPage.ex1Desc'), icon: "01" },
    { title: t('itinerariesPage.ex2Title'), desc: t('itinerariesPage.ex2Desc'), icon: "02" },
    { title: t('itinerariesPage.ex3Title'), desc: t('itinerariesPage.ex3Desc'), icon: "03" },
    { title: t('itinerariesPage.ex4Title'), desc: t('itinerariesPage.ex4Desc'), icon: "04" },
  ];

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
              {t('itinerariesPage.title')}
            </h1>
            
            <div className="flex flex-col gap-2 mb-10">
              <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('itinerariesPage.subtitle1')}
              </span>
              <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('itinerariesPage.subtitle2')}
              </span>
            </div>

            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic max-w-3xl">
              {t('itinerariesPage.body1')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Cards Row */}
      <section className="py-16 container-custom px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((ex, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-brand-forest/10 shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="text-brand-red font-serif italic text-3xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                {ex.icon}
              </div>
              <h3 className="text-brand-deep font-sans font-bold uppercase tracking-widest text-xs mb-3">
                {ex.title}
              </h3>
              <p className="text-brand-deep/60 text-sm leading-relaxed">
                {ex.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Section */}
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
                {t('itinerariesPage.body2')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/tourisme/tables-d-hotes" className="btn btn-primary">
                {t('itinerariesPage.ctaFisherman')}
              </Link>
              <Link to="/tourisme/hebergements" className="btn btn-outline">
                {t('itinerariesPage.ctaCycling')}
              </Link>
            </div>
          </motion.div>

          {/* Image Grid with Offset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-[3/4] bg-brand-sage/10 rounded-2xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-sm">
                    {t('itinerariesPage.img1Caption')}
                  </span>
                </div>
                <div className="absolute inset-0 bg-brand-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Kelibia Fish Auction
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4 translate-y-12 sm:translate-y-24"
            >
              <div className="aspect-[3/4] bg-brand-forest/10 rounded-2xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-sm text-[#546B41]">
                    {t('itinerariesPage.img2Caption')}
                  </span>
                </div>
                <div className="absolute inset-0 bg-brand-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Inland Cycling Routes
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ data={dynamicContent} />
    </div>
  );
};

export default Itineraries;
