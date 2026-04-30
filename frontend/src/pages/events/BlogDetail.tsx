import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import BlogCard from '../../components/BlogCard';

interface BlogPost {
  id: number;
  slug: string;
  title_en: string;
  title_fr: string;
  body_en: string;
  body_fr: string;
  author: string;
  published_at: string;
  category: string;
  cover_url: string;
}

const BlogDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Fetch the specific article
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) {
          setError('Article not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setArticle(data);
        
        // Fetch related articles (all published posts except current)
        const allRes = await fetch('/api/blog?published=true');
        if (allRes.ok) {
          const allData = await allRes.json();
          const related = allData
            .filter((a: BlogPost) => a.id !== data.id)
            .slice(0, 3);
          setRelatedArticles(related);
        }
      } catch (err) {
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-deep mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center">
          <h1 className="text-4xl font-serif italic mb-6">{error || 'Article not found'}</h1>
          <Link to="/evenements/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const title = language === 'fr' ? article.title_fr : article.title_en;
  const body = language === 'fr' ? article.body_fr : article.body_en;

  return (
    <div className="bg-brand-cream pb-24">
      {/* Article Hero */}
      <section className="relative h-[60vh] md:h-[75vh] min-h-[500px] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={article.cover_url} 
          alt={title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-20 px-6">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex gap-4 mb-8">
                <span className="inline-block bg-brand-red text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl">
                  {article.category}
                </span>
                <span className="inline-block bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/20">
                  {article.published_at}
                </span>
              </div>
              <h1 className="text-white text-4xl md:text-7xl font-serif italic leading-[1.1] mb-8">
                {title}
              </h1>
              
              <div className="flex items-center gap-4 text-brand-sage font-bold uppercase tracking-widest text-[11px]">
                <div className="w-10 h-[1px] bg-brand-sage" />
                <span>By {article.author}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breadcrumb / Back Button */}
      <section className="bg-brand-deep/5 border-b border-brand-forest/5 py-6 mb-12">
        <div className="container-custom px-6">
          <Link 
            to="/evenements/blog" 
            className="group inline-flex items-center gap-3 text-brand-forest hover:text-brand-red transition-all text-xs font-bold uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-full border border-brand-forest/20 flex items-center justify-center group-hover:border-brand-red group-hover:bg-brand-red group-hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>{language === 'fr' ? 'Retour au Blog' : 'Back to Blog'}</span>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom px-6 mb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-xl prose-brand-deep leading-[1.8] font-sans text-brand-deep/80"
          >
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </motion.div>
          
          <div className="mt-20 pt-12 border-t border-brand-forest/10 flex items-center justify-between">
            <button className="flex items-center gap-3 text-brand-forest font-bold uppercase tracking-[0.2em] text-[10px] hover:text-brand-red transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share this Story</span>
            </button>
          </div>
        </div>
      </section>

      {/* More Stories Section (Related Articles) */}
      <section className="bg-white/50 py-24 border-t border-brand-forest/5">
        <div className="container-custom px-6 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-brand-red text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block"
          >
            {t('blogIntro.relatedPosts')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-brand-deep text-4xl md:text-5xl font-serif italic mb-16"
          >
            {t('blogIntro.moreStories')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {relatedArticles.map(art => (
              <BlogCard key={art.id} article={art} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
