import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const PlaceholderPage = ({ title, subtitle }: { title: string, subtitle: string }) => {
  const { language } = useLanguage();

  const content = {
    fr: {
      label: "Exploration",
      details: "Détails",
      title: "Contenu en cours de création",
      desc: (t: string) => `Cette page est dédiée à ${t.toLowerCase()}. Nous préparons une expérience immersive pour vous faire découvrir toutes les facettes de ce sujet.`,
      btn: "En savoir plus"
    },
    en: {
      label: "Exploration",
      details: "Details",
      title: "Content under creation",
      desc: (t: string) => `This page is dedicated to ${t.toLowerCase()}. We are preparing an immersive experience to let you discover all facets of this subject.`,
      btn: "Learn more"
    }
  };

  const t = content[language];

  return (
    <div className="bg-brand-cream min-h-screen font-sans">
      <section className="bg-brand-deep text-white pt-24 md:pt-32 pb-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="eyebrow"><span className="text-brand-sage">{t.label}</span></div>
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-serif italic mb-4 leading-tight">{title}</h1>
            <p className="text-white/60 max-w-[600px] text-base md:text-lg">{subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              className="h-[300px] md:h-[450px] bg-brand-sage/10 rounded-md overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <img src={`https://picsum.photos/seed/${title}/800/600`} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="eyebrow"><span>{t.details}</span></div>
              <h2 className="text-2xl md:text-4xl text-brand-deep mb-6">{t.title}</h2>
              <p className="text-brand-deep/70 text-base md:text-lg mb-8 leading-relaxed">{t.desc(title)}</p>
              <button className="btn btn-primary">{t.btn}</button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaceholderPage;
