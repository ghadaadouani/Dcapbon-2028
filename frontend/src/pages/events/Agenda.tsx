import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import Calendar from '../../components/Calendar';

const AgendaPage = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-deep pt-32 pb-20 px-6 relative overflow-hidden text-white">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block text-brand-sage text-[10px] font-bold uppercase tracking-[0.4em] mb-4 font-sans">
              {t('nav.news')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-4 leading-tight">
              {t('nav.agenda')}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro Block Content (Inside Cream Area) */}
      <section className="container-custom px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl"
        >
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
              {t('agendaIntro.subtitle1')}
            </span>
            <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
              {t('agendaIntro.subtitle2')}
            </span>
          </div>

          <h2 className="text-brand-deep text-4xl md:text-6xl font-serif italic mb-10 leading-tight">
            {t('agendaIntro.title')}
          </h2>
          
          <div className="flex flex-col gap-12">
            <div className="prose prose-xl prose-brand-deep text-brand-deep/80 leading-relaxed font-sans max-w-none">
              <p className="mb-8 font-medium italic">{t('agendaIntro.body1')}</p>
              <p className="mb-12">{t('agendaIntro.body2')}</p>
            </div>

            {/* Intro Images - Matching the requested visual layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="flex flex-col gap-4">
                <div className="aspect-video bg-brand-forest/5 rounded-3xl overflow-hidden relative group shadow-2xl border border-brand-forest/10">
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                    <span className="text-brand-deep/40 font-serif italic text-base">
                      {t('agendaIntro.img1Caption')}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                  Festival of Harissa (October)
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="aspect-video bg-brand-forest/5 rounded-2xl overflow-hidden relative group shadow-2xl border border-brand-forest/10">
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                    <span className="text-brand-deep/40 font-serif italic text-base">
                      {t('agendaIntro.img2Caption')}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                  Orange Blossom Harvest (April)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Calendar Section */}
      <section className="container-custom px-6 pb-24 border-t border-brand-forest/5 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Calendar />
        </motion.div>

        {/* Info Text */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-brand-deep/60 italic text-sm leading-relaxed">
            {language === 'fr' 
              ? "Le calendrier est mis à jour régulièrement. Certaines dates peuvent être sujettes à modification selon les conditions locales."
              : "The calendar is updated regularly. Some dates may be subject to change depending on local conditions."
            }
          </p>
        </div>
      </section>
    </div>
  );
};

export default AgendaPage;
