import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Sun, Utensils } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Accommodations = () => {
  const { language, t } = useLanguage();

  const properties = [
    { name: t('accommodationPage.prop1Name'), desc: t('accommodationPage.prop1Desc') },
    { name: t('accommodationPage.prop2Name'), desc: t('accommodationPage.prop2Desc') },
    { name: t('accommodationPage.prop3Name'), desc: t('accommodationPage.prop3Desc') },
    { name: t('accommodationPage.prop4Name'), desc: t('accommodationPage.prop4Desc') },
  ];

  const commitments = [
    { icon: <Leaf className="w-5 h-5" />, label: t('accommodationPage.sust1') },
    { icon: <Sun className="w-5 h-5" />, label: t('accommodationPage.sust2') },
    { icon: <Utensils className="w-5 h-5" />, label: t('accommodationPage.sust3') },
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
              {t('accommodationPage.title')}
            </h1>
            
            <div className="flex flex-col gap-2 mb-10">
              <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('accommodationPage.subtitle1')}
              </span>
              <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('accommodationPage.subtitle2')}
              </span>
            </div>

            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic max-w-3xl">
              {t('accommodationPage.body1')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sustainability Commitments Bar */}
      <section className="py-12 bg-white border-y border-brand-forest/5 relative z-20">
        <div className="container-custom px-6 flex flex-wrap justify-center md:justify-around gap-8">
          {commitments.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 text-brand-forest"
            >
              <div className="w-10 h-10 rounded-full bg-brand-sage/10 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em]">
                {item.label}
              </span>
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
                {t('accommodationPage.body2')}
              </p>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
              {properties.map((prop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-brand-forest/10 shadow-sm hover:shadow-lg transition-all"
                >
                  <h3 className="text-brand-deep font-serif italic text-xl mb-2">{prop.name}</h3>
                  <p className="text-brand-deep/60 text-sm leading-snug">{prop.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-16">
              <Link to="/tourisme/itineraires" className="btn btn-primary">
                {t('accommodationPage.ctaLodges')}
              </Link>
              <Link to="/la-region/projet-candidature" className="btn btn-outline">
                {t('accommodationPage.ctaCommitments')}
              </Link>
            </div>
          </motion.div>

          {/* Image Placeholders */}
          <div className="flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-[16/10] bg-brand-sage/10 rounded-3xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base md:text-lg">
                    {t('accommodationPage.img1Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Local Architecture & Nature
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-[16/10] bg-brand-forest/10 rounded-3xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base md:text-lg text-[#546B41]">
                    {t('accommodationPage.img2Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Sustainable Gastronomy Start
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accommodations;
