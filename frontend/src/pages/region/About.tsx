import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { usePageContent } from '../../hooks/usePageContent';
import FAQ from '../../components/FAQ';

const About = () => {
  const { language, t } = useLanguage();
  const { content: dynamicContent } = usePageContent('region', null);

  const fields = {
      title: dynamicContent ? (language === 'fr' ? dynamicContent.title_fr : dynamicContent.title_en) : t('aboutPage.title'),
      subtitle1: dynamicContent ? (language === 'fr' ? dynamicContent.subtitle_1_fr : dynamicContent.subtitle_1_en) : t('aboutPage.subtitle1'),
      subtitle2: dynamicContent ? (language === 'fr' ? dynamicContent.subtitle_2_fr : dynamicContent.subtitle_2_en) : t('aboutPage.subtitle2'),
      body1: dynamicContent ? (language === 'fr' ? dynamicContent.body_1_fr : dynamicContent.body_1_en) : t('aboutPage.body1'),
      body2: dynamicContent ? (language === 'fr' ? dynamicContent.body_2_fr : dynamicContent.body_2_en) : t('aboutPage.body2'),
  };

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-brand-deep pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img 
            src={dynamicContent?.image_1_id_url || "https://images.unsplash.com/photo-1590494056263-d8c5478417c8?auto=format&fit=crop&q=80&w=800"}
            className="w-full h-full object-cover"
            alt="Cap Bon texture"
          />
        </div>

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
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: fields.title }} />
            
            <div className="flex flex-col gap-2 mb-10">
              <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em]" dangerouslySetInnerHTML={{ __html: fields.subtitle1 }} />
              <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em]" dangerouslySetInnerHTML={{ __html: fields.subtitle2 }} />
            </div>

            <div className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic" dangerouslySetInnerHTML={{ __html: fields.body1 }} />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding container-custom px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-brand-deep/80 text-lg md:text-xl leading-relaxed font-sans relative z-10 overflow-hidden min-w-0"
          >
            <div className="mb-12 break-words" dangerouslySetInnerHTML={{ __html: fields.body2 }} />
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/la-region/projet-candidature" className="btn btn-primary">
                {t('aboutPage.ctaHeritage')}
              </Link>
              <Link to="/gastronomie/produits-phares" className="btn btn-outline">
                {t('aboutPage.ctaTerroir')}
              </Link>
            </div>
          </motion.div>

          {/* Image Placeholders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 relative z-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-[4/5] bg-brand-sage/10 rounded-2xl overflow-hidden relative group shadow-xl">
                {dynamicContent?.image_2_id_url ? (
                  <img 
                    src={dynamicContent.image_2_id_url} 
                    alt={dynamicContent?.image_2_alt_en || 'Image 1'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5">
                    <span className="text-brand-deep/30 font-serif italic text-sm">
                      {t('aboutPage.img1Caption')}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-brand-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                {language === 'fr' ? 'L\'Autoroute Liquide' : 'The Liquid Highway'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col gap-4 translate-y-8 sm:translate-y-16"
            >
              <div className="aspect-[4/5] bg-brand-forest/10 rounded-2xl overflow-hidden relative group shadow-xl">
                {dynamicContent?.image_3_id_url ? (
                  <img 
                    src={dynamicContent.image_3_id_url} 
                    alt={dynamicContent?.image_3_alt_en || 'Image 2'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5">
                    <span className="text-brand-deep/30 font-serif italic text-sm text-[#546B41]">
                      {t('aboutPage.img2Caption')}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-brand-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                {language === 'fr' ? 'Ruines de Kerkouane' : 'Kerkouane Ruins'}
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

export default About;
