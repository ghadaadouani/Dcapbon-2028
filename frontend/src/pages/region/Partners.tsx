import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { usePageContent } from '../../hooks/usePageContent';
import FAQ from '../../components/FAQ';

const foundingPartners = [
  { name: "Sawa Taste of Tunisia", desc: "Private Sector & Experience Development" },
  { name: "ONTT", desc: "Public Sector & Tourism Strategy" },
  { name: "ATPNE", desc: "Third Sector & Environmental Protection" },
  { name: "IFMT", desc: "Education & Workforce Training" },
];

const hospitalityPioneers = [
  { name: "La Badira", location: "Hammamet" },
  { name: "Villa Maamoura", location: "Maamoura" },
  { name: "Kurubis", location: "Korba" },
  { name: "Aricajade", location: "Kelibia" },
];

const Partners = () => {
  const { language, t } = useLanguage();
  const { content: dynamicContent } = usePageContent('partners', null);

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
            <span className="inline-block text-brand-sage text-xs font-bold uppercase tracking-[0.3em] mb-6">
              {t('nav.region')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 leading-tight">
              {t('partnersPage.title')}
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic max-w-2xl">
              {t('partnersPage.body1')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founding Pillars Section */}
      <section className="section-padding container-custom px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="eyebrow"><span>{t('partnersPage.subtitle1')}</span></div>
          <h2 className="text-brand-deep text-3xl md:text-5xl font-serif italic mb-12">
            The Coalition Foundations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundingPartners.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-brand-forest/10 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="h-16 flex items-center mb-6">
                <span className="text-brand-forest font-bold uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">
                  {item.name}
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-sage">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Heritage & Hospitality Section */}
      <section className="section-padding bg-brand-forest/5 relative overflow-hidden">
        <div className="container-custom px-6 mb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="eyebrow"><span>{t('partnersPage.subtitle2')}</span></div>
              <h2 className="text-brand-deep text-4xl md:text-6xl font-serif italic mb-8 leading-tight">
                Guardians of the Terroir
              </h2>
              <p className="text-brand-deep/80 text-lg md:text-xl leading-relaxed font-sans mb-10">
                {t('partnersPage.body2')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/la-region/projet-candidature" className="btn btn-primary">
                  {t('partnersPage.ctaBoard')}
                </Link>
                <Link to="/gastronomie/les-arts-du-cap-bon" className="btn btn-outline">
                  {t('partnersPage.ctaGDA')}
                </Link>
              </div>
            </motion.div>

            {/* Portrait Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] bg-brand-sage/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-sm">
                <span className="text-brand-deep/30 font-serif italic text-base md:text-lg">
                  {t('partnersPage.gdaCaption')}
                </span>
              </div>
              <div className="absolute inset-0 bg-brand-forest/5 opacity-0 hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
        </div>

        {/* Hospitality Pioneer Carousel */}
        <div className="mt-24">
          <div className="container-custom px-6 mb-8 flex justify-between items-end">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-forest">
              {t('partnersPage.hospitalitySubtitle')}
            </span>
          </div>
          
          <div className="relative">
            <motion.div 
              className="flex gap-6 px-12"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 40, 
                ease: "linear", 
                repeat: Infinity 
              }}
            >
              {[...hospitalityPioneers, ...hospitalityPioneers].map((p, i) => (
                <div 
                  key={i} 
                  className="bg-white p-10 rounded-2xl border border-brand-forest/10 min-w-[300px] flex flex-col justify-between aspect-video shadow-sm hover:shadow-lg transition-all"
                >
                  <span className="text-2xl font-serif italic text-brand-deep">{p.name}</span>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-sage">{p.location}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red opacity-30" />
                  </div>
                </div>
              ))}
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-cream to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-cream to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ data={dynamicContent} />
    </div>
  );
};

export default Partners;
