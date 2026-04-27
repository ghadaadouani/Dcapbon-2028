import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const candidacyPillars = [
  { id: 1, title: "Feeding the Planet", desc: "Protecting biodiversity and ancestral white wheat." },
  { id: 2, title: "Innovation", desc: "Youth-led Food Labs and culinary tech." },
  { id: 3, title: "Urban-Rural Link", desc: "Direct farm-to-table supply chains." },
  { id: 4, title: "Wellness", desc: "Promoting the Mediterranean Diet globally." },
  { id: 5, title: "Education", desc: "Workforce training and heritage preservation." },
  { id: 6, title: "Sustainability", desc: "Regenerative tourism beyond the resort bubble." },
];

const Candidature = () => {
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
            <span className="inline-block text-brand-forest text-xs font-bold uppercase tracking-[0.3em] mb-6 font-sans">
              {t('nav.bid')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 leading-tight">
              {t('candidacyPage.title')}
            </h1>
            
            <div className="flex flex-col gap-2 mb-10">
              <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('candidacyPage.subtitle1')}
              </span>
              <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('candidacyPage.subtitle2')}
              </span>
            </div>

            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic max-w-3xl">
              {t('candidacyPage.body1')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
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
                {t('candidacyPage.body2')}
              </p>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
              {candidacyPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-brand-forest/10 shadow-sm"
                >
                  <div className="text-brand-red font-serif italic text-2xl mb-2">0{pillar.id}</div>
                  <h3 className="text-brand-deep font-sans font-bold uppercase tracking-wider text-xs mb-2">
                    {language === 'fr' ? (
                      pillar.id === 1 ? "Nourrir la Planète" :
                      pillar.id === 2 ? "Innovation" :
                      pillar.id === 3 ? "Lien Urbain-Rural" :
                      pillar.id === 4 ? "Bien-être" :
                      pillar.id === 5 ? "Éducation" : "Durabilité"
                    ) : pillar.title}
                  </h3>
                  <p className="text-brand-deep/60 text-sm leading-tight">
                    {language === 'fr' ? (
                      pillar.id === 1 ? "Protéger la biodiversité et le blé blanc ancestral." :
                      pillar.id === 2 ? "Food Labs dirigés par les jeunes et culinaire tech." :
                      pillar.id === 3 ? "Chaînes d'approvisionnement directes ferme-à-la-table." :
                      pillar.id === 4 ? "Promouvoir le Régime Méditerranéen globalement." :
                      pillar.id === 5 ? "Formation de la main-d'œuvre et préservation du patrimoine." : "Tourisme régénératif au-delà de la bulle hôtelière."
                    ) : pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-16">
              <Link to="/contact" className="btn btn-primary">
                {t('candidacyPage.ctaManifesto')}
              </Link>
              <Link to="/evenements/agenda" className="btn btn-outline">
                {t('candidacyPage.ctaPlan')}
              </Link>
            </div>
          </motion.div>

          {/* Side Media */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-video bg-brand-forest/5 rounded-3xl overflow-hidden border border-brand-forest/10 relative group shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base">
                    {t('candidacyPage.roadmapCaption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center">
                Roadmap 2025-2030
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-square bg-brand-sage/5 rounded-3xl overflow-hidden border border-brand-forest/10 relative group shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base">
                    {t('candidacyPage.splitCaption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center">
                Regenerative Shift
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Candidature;
