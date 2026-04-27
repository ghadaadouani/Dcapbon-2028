import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shovel, ChefHat, Sprout, Recycle, HeartHandshake, Ban } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Mice = () => {
  const { language, t } = useLanguage();

  const activities = [
    { title: t('micePage.activity1'), desc: t('micePage.activity1Desc'), icon: <ChefHat className="w-6 h-6" /> },
    { title: t('micePage.activity2'), desc: t('micePage.activity2Desc'), icon: <HeartHandshake className="w-6 h-6" /> },
    { title: t('micePage.activity3'), desc: t('micePage.activity3Desc'), icon: <Shovel className="w-6 h-6" /> },
  ];

  const sustainability = [
    { label: t('micePage.sust1'), icon: <Sprout className="w-5 h-5" /> },
    { label: t('micePage.sust2'), icon: <Ban className="w-5 h-5" /> },
    { label: t('micePage.sust3'), icon: <Recycle className="w-5 h-5" /> },
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
            <span className="inline-block text-brand-forest text-xs font-bold uppercase tracking-[0.3em] mb-6 font-sans">
              {t('nav.mice')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 leading-tight">
              {t('micePage.title')}
            </h1>
            
            <div className="flex flex-col gap-2 mb-10">
              <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('micePage.subtitle1')}
              </span>
              <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
                {t('micePage.subtitle2')}
              </span>
            </div>

            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic max-w-3xl">
              {t('micePage.body1')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Building Activities */}
      <section className="py-16 container-custom px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-brand-forest/10 shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-full bg-brand-forest/10 text-brand-forest flex items-center justify-center mb-6 group-hover:bg-brand-forest group-hover:text-white transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-brand-deep font-sans font-bold uppercase tracking-widest text-xs mb-3">
                {item.title}
              </h3>
              <p className="text-brand-deep/60 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content & Sustainability */}
      <section className="section-padding container-custom px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="prose prose-brand-deep text-brand-deep/80 text-lg md:text-xl leading-relaxed font-sans max-w-none mb-16">
              <p>
                {t('micePage.body2')}
              </p>
            </div>

            {/* Sustainability Commitment Row */}
            <div className="bg-brand-forest/5 p-8 rounded-3xl border border-brand-forest/10 mb-12">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-forest block mb-6 px-2">
                Our MICE Commitments
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {sustainability.map((item, index) => (
                  <div key={index} className="flex flex-col gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-red shadow-sm">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-deep/70">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <a href="#" className="btn btn-primary" onClick={(e) => e.preventDefault()}>
                {t('micePage.ctaBrochure')}
              </a>
              <Link to="/contact" className="btn btn-outline">
                {t('micePage.ctaPlan')}
              </Link>
            </div>
          </motion.div>

          {/* Media Grid */}
          <div className="flex flex-col gap-12 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-[4/3] bg-brand-sage/10 rounded-3xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base md:text-lg">
                    {t('micePage.img1Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Interactive Learning
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-[4/3] bg-brand-forest/10 rounded-3xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                  <span className="text-brand-deep/40 font-serif italic text-base md:text-lg text-[#546B41]">
                    {t('micePage.img2Caption')}
                  </span>
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                Regenerative Wellness
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mice;
