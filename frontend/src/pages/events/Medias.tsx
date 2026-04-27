import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, Award, Gift, FileText, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { usePageContent } from '../../hooks/usePageContent';

const MediasPage = () => {
  const { t, language } = useLanguage();
  const { content: dynamicContent } = usePageContent('media', null);

  const initiatives = [
    {
      id: 'chef',
      icon: <Award className="w-6 h-6 text-brand-red" />,
      title: t('media.initiatives.chef.title'),
      desc: t('media.initiatives.chef.desc'),
    },
    {
      id: 'gift',
      icon: <Gift className="w-6 h-6 text-brand-sage" />,
      title: t('media.initiatives.gift.title'),
      desc: t('media.initiatives.gift.desc'),
    },
    {
      id: 'kit',
      icon: <FileText className="w-6 h-6 text-brand-forest" />,
      title: t('media.initiatives.kit.title'),
      desc: t('media.initiatives.kit.desc'),
    }
  ];

  const partners = ['IGCAT', 'Sicily', 'Aseer (Saudi Arabia)'];

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-deep pt-32 pb-20 px-6 relative overflow-hidden text-white text-center">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block text-brand-sage text-[10px] font-bold uppercase tracking-[0.4em] mb-4 font-sans">
              {t('nav.media')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-4 leading-tight">
              {dynamicContent ? (language === 'fr' ? dynamicContent.title_fr : dynamicContent.title_en) : t('media.title')}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro & Main Content Block */}
      <section className="container-custom px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Subtitles & Intro Text */}
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
              {dynamicContent ? (language === 'fr' ? dynamicContent.subtitle_1_fr : dynamicContent.subtitle_1_en) : t('media.subtitle1')}
            </span>
            <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
              {dynamicContent ? (language === 'fr' ? dynamicContent.subtitle_2_fr : dynamicContent.subtitle_2_en) : t('media.subtitle2')}
            </span>
          </div>

          <div className="prose prose-xl prose-brand-deep text-brand-deep/80 leading-relaxed font-sans max-w-none mb-16">
            <p className="mb-8 font-medium italic">{dynamicContent ? (language === 'fr' ? dynamicContent.body_1_fr : dynamicContent.body_1_en) : t('media.body1')}</p>
            <p className="">{dynamicContent ? (language === 'fr' ? dynamicContent.body_2_fr : dynamicContent.body_2_en) : t('media.body2')}</p>
          </div>

          {/* Initiatives Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {initiatives.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-2xl shadow-xl border border-brand-forest/5 flex flex-col h-full group hover:translate-y-[-8px] transition-all duration-500"
              >
                <div className="mb-6 bg-brand-cream w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-brand-deep text-xl font-serif italic mb-4">
                  {item.title}
                </h3>
                <p className="text-brand-deep/60 text-sm leading-relaxed mb-6 flex-grow">
                  {item.desc}
                </p>
                <div className="w-8 h-[1px] bg-brand-forest/20 group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>

          {/* Media/Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            <div className="flex flex-col gap-4">
              <div className="aspect-video bg-brand-forest/5 rounded-3xl overflow-hidden relative group shadow-2xl border border-brand-forest/10">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base lg:text-lg px-6">
                    {t('media.img1Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                MENA Young Chef Awards
              </p>
            </div>
            <div className="flex flex-col gap-4 md:translate-y-12">
              <div className="aspect-video bg-brand-forest/5 rounded-3xl overflow-hidden relative group shadow-2xl border border-brand-forest/10">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base lg:text-lg px-6">
                    {t('media.img2Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                World Food Gift Challenge
              </p>
            </div>
          </div>

          {/* Partners Strip */}
          <div className="mt-12 py-12 border-y border-brand-forest/10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-deep/40 w-full text-center mb-4">
              Strategic International Partners
            </span>
            {partners.map((partner) => (
              <span key={partner} className="text-brand-deep/60 font-serif italic text-xl">
                {partner}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mt-24">
            <a 
              href="/press-kit.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary flex items-center gap-3 px-8"
            >
              <FileDown className="w-5 h-5" />
              {dynamicContent ? (language === 'fr' ? dynamicContent.button_1_label_fr : dynamicContent.button_1_label_en) : t('media.ctaPress')}
            </a>
            <button 
              onClick={(e) => e.preventDefault()}
              className="btn btn-outline flex items-center gap-3 px-8 group border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white"
            >
              <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              {dynamicContent ? (language === 'fr' ? dynamicContent.button_2_label_fr : dynamicContent.button_2_label_en) : t('media.ctaChefs')}
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default MediasPage;
