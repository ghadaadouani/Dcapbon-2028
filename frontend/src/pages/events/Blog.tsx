import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import BlogCard from '../../components/BlogCard';

const BlogPage = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Gastronomy', 'Culture', 'Tourism', 'Environment', 'News'];

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => setArticles(Array.isArray(data) ? data.filter((a: any) => a.is_published) : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      <section className="bg-brand-deep pt-32 pb-20 px-6 relative overflow-hidden text-white">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <span className="inline-block text-brand-sage text-[10px] font-bold uppercase tracking-[0.4em] mb-4 font-sans">{t('nav.news')}</span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-4 leading-tight">{t('nav.blog')}</h1>
          </motion.div>
        </div>
      </section>

      <section className="container-custom px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-6xl">
          <h2 className="text-brand-deep text-4xl md:text-6xl font-serif italic mb-10 leading-tight">{t('blogIntro.title')}</h2>
          <div className="prose prose-brand-deep text-brand-deep/80 text-lg md:text-xl leading-relaxed font-sans max-w-none">
            <p className="mb-8 font-medium italic">{t('blogIntro.body1')}</p>
            <p className="mb-12">{t('blogIntro.body2')}</p>
          </div>
        </motion.div>
      </section>

      <section className="container-custom px-6 relative z-10 pb-24 border-t border-brand-forest/5 pt-20">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-brand-deep text-[10px] font-bold uppercase tracking-[0.4em] mb-12">
            {language === 'fr' ? 'Parcourir les publications' : 'Browse All Posts'}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border ${
                  activeCategory === cat
                    ? 'bg-brand-red text-white border-brand-red shadow-xl scale-105'
                    : 'bg-white text-brand-deep/50 border-brand-forest/10 hover:border-brand-forest/30 hover:text-brand-deep'
                }`}
              >{cat}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 opacity-30">
            <p className="font-serif italic">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <h3 className="text-2xl font-serif italic">{language === 'fr' ? 'Aucun article trouvé' : 'No articles found'}</h3>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;
