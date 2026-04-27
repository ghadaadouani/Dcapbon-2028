import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BlogCardProps {
  article: {
    id: number;
    slug: string;
    title_en: string;
    title_fr: string;
    excerpt_en?: string;
    excerpt_fr?: string;
    cover_url?: string;
    category?: string;
    author?: string;
    published_at?: string;
    created_at?: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ article }) => {
  const { language } = useLanguage();
  const title = language === 'fr' ? article.title_fr : article.title_en;
  const excerpt = language === 'fr' ? article.excerpt_fr : article.excerpt_en;
  const date = (article.published_at || article.created_at || '').split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-brand-cream border border-brand-forest/10 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden bg-brand-deep/10">
        {article.cover_url && (
          <img src={article.cover_url} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        )}
        {article.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-brand-forest text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-[11px] text-brand-forest/60 uppercase tracking-widest mb-3">
          {date && <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{date}</span></div>}
          {article.author && <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>{article.author}</span></div>}
        </div>
        <h3 className="text-brand-deep text-xl font-serif font-medium mb-3 group-hover:text-brand-red transition-colors">{title}</h3>
        {excerpt && <p className="text-brand-deep/70 text-sm line-clamp-2 mb-6 flex-grow">{excerpt}</p>}
        <Link to={`/evenements/blog/${article.slug}`} className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
          <span>{language === 'fr' ? 'Lire la suite' : 'Read more'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogCard;
