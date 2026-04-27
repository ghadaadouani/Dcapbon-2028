import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ scrolled }: { scrolled: boolean }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="flex items-center ml-4 border-l border-current/20 pl-4">
      <button
        onClick={toggleLanguage}
        className={`text-[10px] font-bold tracking-[0.2em] transition-all hover:tracking-[0.3em] flex items-center gap-2 ${scrolled ? 'text-brand-deep' : 'text-white'}`}
      >
        <span>{language.toUpperCase()}</span>
        <span className="opacity-30">/</span>
        <span className="opacity-50">{language === 'en' ? 'FR' : 'EN'}</span>
      </button>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      label: t('nav.region'),
      href: '/la-region/a-propos',
      dropdown: [
        { label: t('nav.about'), href: '/la-region/a-propos' },
        { label: t('nav.partners'), href: '/la-region/partners' },
        { label: t('nav.bid'), href: '/la-region/projet-candidature' },
      ],
    },
    {
      label: t('nav.gastronomy'),
      href: '/gastronomie/les-arts-du-cap-bon',
      dropdown: [
        { label: t('nav.artisanalCrafts'), href: '/gastronomie/les-arts-du-cap-bon' },
        { label: t('nav.flagship'), href: '/gastronomie/produits-phares' },
        { label: t('nav.specialities'), href: '/gastronomie/plats-specialites' },
      ],
    },
    {
      label: t('nav.tourism'),
      href: '/tourisme/itineraires',
      dropdown: [
        { label: t('nav.itineraries'), href: '/tourisme/itineraires' },
        { label: t('nav.accommodation'), href: '/tourisme/hebergements' },
        { label: t('nav.restaurants'), href: '/tourisme/tables-d-hotes' },
        { label: t('nav.mice'), href: '/tourisme/mice' },
      ],
    },
    {
      label: t('nav.news'),
      href: '/evenements/blog',
      dropdown: [
        { label: t('nav.blog'), href: '/evenements/blog' },
        { label: t('nav.agenda'), href: '/evenements/agenda' },
        { label: t('nav.media'), href: '/evenements/medias' },
        { label: t('nav.gallery'), href: '/evenements/galerie' },
      ],
    },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-6 md:px-12 transition-all duration-500 ease-in-out ${scrolled || mobileMenuOpen ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      {!scrolled && !mobileMenuOpen && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/30 to-transparent pointer-events-none z-[-1]" />
      )}
      
      <Link to="/" className={`font-serif text-xl md:text-2xl no-underline transition-colors duration-300 ${scrolled || mobileMenuOpen ? 'text-brand-deep' : 'text-white'}`}>
        <span className="text-brand-forest">Cap</span><span className="text-brand-red">Bon</span> <span className="hidden sm:inline">Discover</span>
      </Link>

      <div className="hidden md:flex gap-8 lg:gap-12 items-center">
        {navItems.map((item) => (
          <div key={item.label} className="relative group h-full flex items-center">
            <Link
              to={item.href}
              className={`font-sans text-[11px] font-bold uppercase tracking-[0.1em] no-underline transition-colors duration-400 hover:text-brand-forest py-6 ${scrolled ? 'text-brand-deep' : 'text-white'}`}
            >
              {item.label}
            </Link>
            {item.dropdown && (
              <div className="absolute top-[calc(100%-12px)] left-[-16px] pt-3 min-w-[200px] opacity-0 pointer-events-none translate-y-[-8px] transition-all duration-250 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 z-[100]">
                <div className="bg-white border-t-4 border-brand-forest shadow-2xl py-2 rounded-b cursor-default">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.href}
                      className="block px-6 py-2.5 font-sans text-[12px] font-bold text-brand-deep/70 no-underline transition-all duration-150 hover:bg-brand-sage/10 hover:text-brand-forest whitespace-nowrap"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-6">
          <Link 
            to="/contact" 
            className={`btn btn-sm ${scrolled ? 'btn-primary' : 'btn-outline border-white text-white hover:border-brand-red'}`}
          >
            {t('common.contact')}
          </Link>
          <LanguageSwitcher scrolled={scrolled} />
        </div>
      </div>

      <div className="md:hidden flex items-center gap-4">
        <LanguageSwitcher scrolled={scrolled || mobileMenuOpen} />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={scrolled || mobileMenuOpen ? 'text-brand-deep' : 'text-white'}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[72px] left-0 right-0 bg-brand-cream border-t border-brand-sage/20 overflow-hidden md:hidden shadow-xl"
          >
            <div className="p-8 flex flex-col gap-8">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link to={item.href} className="text-2xl font-serif italic text-brand-deep block mb-4">{item.label}</Link>
                  {item.dropdown && (
                    <div className="pl-6 flex flex-col gap-3">
                      {item.dropdown.map((sub) => (
                        <Link key={sub.label} to={sub.href} className="text-brand-deep/60 text-base">{sub.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/contact" className="btn btn-primary w-full mt-4">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { language, t } = useLanguage();
  return (
    <footer className="bg-brand-deep py-12 border-t-[3px] border-brand-sage text-white">
      <div className="container-custom">
        <div className="flex flex-wrap justify-between items-start gap-10">
          <div className="max-w-[300px]">
            <div className="font-serif text-xl mb-6">
              <span className="text-brand-sage">Cap</span><span className="text-brand-red">Bon</span> Discover
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              {t('footer.tagline')}. {language === 'fr' ? 'Candidate Région Mondiale de Gastronomie 2028' : 'World Region of Gastronomy Candidate 2028'}.
            </p>
          </div>
          <div className="flex gap-12 md:gap-20">
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-brand-sage">{language === 'fr' ? 'Navigation' : 'Navigation'}</h4>
              <div className="flex flex-col gap-3">
                <Link to="/la-region/a-propos" className="text-white/60 hover:text-white transition-colors no-underline text-xs">{t('nav.region')}</Link>
                <Link to="/gastronomie/les-arts-du-cap-bon" className="text-white/60 hover:text-white transition-colors no-underline text-xs">{t('nav.gastronomy')}</Link>
                <Link to="/tourisme/itineraires" className="text-white/60 hover:text-white transition-colors no-underline text-xs">{t('nav.tourism')}</Link>
                <Link to="/evenements/blog" className="text-white/60 hover:text-white transition-colors no-underline text-xs">{t('nav.news')}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] mb-6 text-brand-sage">Social</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-white/60 hover:text-white transition-colors no-underline text-xs">Instagram</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors no-underline text-xs">Facebook</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors no-underline text-xs">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-white/30 uppercase tracking-widest font-sans font-bold">
          <div>© 2026 Discover Cap Bon · Gouvernorat de Nabeul · Tunisie</div>
          <span>{language === 'fr' ? 'Candidate Région Mondiale de Gastronomie 2028' : 'World Region of Gastronomy Candidate 2028'}</span>
        </div>
      </div>
    </footer>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const lerp = () => {
      setRingPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.12,
        y: prev.y + (mousePos.y - prev.y) * 0.12,
      }));
      requestAnimationFrame(lerp);
    };
    const frame = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(frame);
  }, [mousePos]);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll('a, button, .faq-trigger');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        className={`fixed w-8 h-8 border-[1.5px] border-brand-forest rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 will-change-[left,top] ${isHovering ? 'scale-150 bg-brand-forest/10' : ''} ${isClicking ? 'scale-[2.2]' : ''}`}
        style={{ left: ringPos.x, top: ringPos.y }}
      />
      <div
        className="fixed w-1 h-1 bg-brand-red rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
    </>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="has-custom-cursor min-h-screen flex flex-col">
      <CustomCursor />
      <Navbar />
      <main className={`flex-grow ${pathname === '/' ? '' : 'pt-[80px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};
