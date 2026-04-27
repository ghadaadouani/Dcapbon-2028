import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Shield, Activity, HelpCircle, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { language, t } = useLanguage();
  const formRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const scrollToForm = () => {
    setFormData(prev => ({
      ...prev,
      message: language === 'fr' 
        ? "Je souhaite postuler pour devenir Ambassadeur du Cap Bon 2028." 
        : "I would like to apply to be a Cap Bon 2028 Ambassador."
    }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const usefulContacts = [
    { name: "Police", phone: "197", icon: <Shield className="w-5 h-5" /> },
    { name: "S.A.M.U / Hôpital", phone: "190", icon: <Activity className="w-5 h-5" /> },
    { name: "Pompiers", phone: "198", icon: <HelpCircle className="w-5 h-5" /> },
    { name: "CRT Nabeul (Tourism)", phone: "+216 72 285 000", icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-brand-cream min-h-screen">
      <section className="bg-brand-deep text-white pt-32 pb-20">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 italic">{t('common.contact')}</h1>
            <p className="max-w-3xl text-white/70 text-lg leading-relaxed italic">
              {language === 'fr' 
                ? "Nous sommes à votre écoute pour toute question concernant la candidature ou la région."
                : "We are at your service for any questions regarding the candidacy or the region."
              }
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Intro Block Content (Inside Cream Area) */}
      <section className="container-custom px-6 py-24 border-b border-brand-forest/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-brand-sage text-sm font-bold uppercase tracking-[0.2em] font-sans">
              {t('contactIntro.subtitle1')}
            </span>
            <span className="text-brand-red text-sm font-bold uppercase tracking-[0.2em] font-sans">
              {t('contactIntro.subtitle2')}
            </span>
          </div>

          <h2 className="text-brand-deep text-4xl md:text-6xl font-serif italic mb-10 leading-tight">
            {t('contactIntro.title')}
          </h2>
          
          <div className="flex flex-col gap-12">
            <div className="prose prose-xl prose-brand-deep text-brand-deep/80 leading-relaxed font-sans max-w-none">
              <p className="mb-8 font-medium italic">{t('contactIntro.body1')}</p>
              
              {/* Working Groups Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {(t('contactIntro.workingGroups') as unknown as string[]).map((group) => (
                  <span key={group} className="px-4 py-1 bg-brand-forest/5 border border-brand-forest/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-forest">
                    {group}
                  </span>
                ))}
              </div>

              <p className="mb-12">{t('contactIntro.body2')}</p>
            </div>

            {/* Intro Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="flex flex-col gap-4">
                <div className="aspect-video bg-brand-forest/5 rounded-3xl overflow-hidden relative group shadow-2xl border border-brand-forest/10">
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                    <span className="text-brand-deep/40 font-serif italic text-base lg:text-lg px-6">
                      {t('contactIntro.img1Caption')}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                  Multi-Sectoral Collaboration
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="aspect-video bg-brand-forest/5 rounded-3xl overflow-hidden relative group shadow-2xl border border-brand-forest/10">
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-brand-deep/5 backdrop-blur-[2px]">
                    <span className="text-brand-deep/40 font-serif italic text-base lg:text-lg px-6">
                      {t('contactIntro.img2Caption')}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-forest/60 text-center px-4">
                  International Partnerships
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-6 mb-8">
              <button className="btn btn-primary px-8" onClick={scrollToForm}>
                {t('contactIntro.ctaAmbassador')}
              </button>
              <a href="/sponsorship-kit.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline px-8">
                {t('contactIntro.ctaSponsor')}
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-padding container-custom px-6" ref={formRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-serif italic text-brand-deep mb-8">{language === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}</h2>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-sage/10 p-8 rounded-2xl border border-brand-sage/20 text-center"
              >
                <div className="w-16 h-16 bg-brand-sage rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-serif italic text-brand-forest mb-2">
                  {language === 'fr' ? 'Message envoyé !' : 'Message Sent!'}
                </h3>
                <p className="text-brand-forest/70 text-sm">
                  {language === 'fr' 
                    ? "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais."
                    : "Thank you for your message. Our team will get back to you as soon as possible."}
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-brand-red text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  {language === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                </button>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-brand-forest mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-brand-forest/10 p-4 focus:border-brand-red outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-brand-forest mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-brand-forest/10 p-4 focus:border-brand-red outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-brand-forest mb-2">Message</label>
                  <textarea 
                    rows={6} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-brand-forest/10 p-4 focus:border-brand-red outline-none transition-colors"
                  ></textarea>
                </div>
                
                {status === 'error' && (
                  <p className="text-brand-red text-xs font-bold">
                    {language === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'Something went wrong. Please try again.'}
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className="btn btn-primary w-full shadow-lg disabled:opacity-50"
                >
                  {status === 'sending' 
                    ? (language === 'fr' ? 'Envoi en cours...' : 'Sending...') 
                    : (language === 'fr' ? 'Envoyer' : 'Send Message')}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-serif italic text-brand-deep mb-8">{language === 'fr' ? 'Contacts Directs' : 'Direct Contacts'}</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-brand-deep/70">
                  <div className="w-10 h-10 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest"><Mail className="w-5 h-5" /></div>
                  <span className="font-sans">contact@capbon2028.tn</span>
                </div>
                <div className="flex items-center gap-4 text-brand-deep/70">
                  <div className="w-10 h-10 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest"><Phone className="w-5 h-5" /></div>
                  <span className="font-sans">+216 72 000 000</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-brand-forest/5">
              <h3 className="text-xl font-serif italic text-brand-red mb-6">{language === 'fr' ? 'Contacts Utiles' : 'Useful Contacts'}</h3>
              <div className="grid grid-cols-1 gap-4">
                {usefulContacts.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-brand-forest/5">
                    <div className="flex items-center gap-3">
                      <div className="text-brand-sage">{c.icon}</div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-brand-deep/80">{c.name}</span>
                    </div>
                    <span className="text-brand-red font-mono font-bold tracking-tighter">{c.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
