import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const FAQ = ({ data }: { data?: any }) => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const defaultContent = {
    fr: {
      label: "Questions",
      title: "Tout savoir sur le projet",
      faqs: [
        { q: "Qu'est-ce que la Région Mondiale de Gastronomie ?", a: "C'est un titre prestigieux décerné par l'IGCAT qui récompense les régions excellant dans la préservation de leur patrimoine culinaire et le développement durable." },
        { q: "Pourquoi le Cap Bon ?", a: "Pour sa biodiversité unique, son climat exceptionnel et la richesse de ses traditions culinaires transmises de génération en génération." },
        { q: "Comment soutenir la candidature ?", a: "En découvrant nos producteurs locaux, en partageant vos expériences et en participant aux événements organisés tout au long de l'année." }
      ]
    },
    en: {
      label: "Questions",
      title: "Everything about the project",
      faqs: [
        { q: "What is the World Region of Gastronomy?", a: "It is a prestigious title awarded by IGCAT that recognizes regions excelling in preserving their culinary heritage and sustainable development." },
        { q: "Why Cap Bon?", a: "For its unique biodiversity, exceptional climate, and the richness of its culinary traditions passed down through generations." },
        { q: "How to support the candidacy?", a: "By discovering our local producers, sharing your experiences, and participating in events organized throughout the year." }
      ]
    }
  };

  const faqs = data?.faqs?.map((faq: any) => ({
    q: language === 'fr' ? faq.q_fr : faq.q_en,
    a: language === 'fr' ? faq.a_fr : faq.a_en
  })) || defaultContent[language].faqs;

  const label = data ? (language === 'fr' ? data.faq_label_fr : data.faq_label_en) : defaultContent[language].label;
  const title = data ? (language === 'fr' ? data.faq_title_fr : data.faq_title_en) : defaultContent[language].title;

  // Don't render if no FAQs
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="eyebrow justify-center"><span>{label}</span></div>
          <h2 className="text-dark">{title}</h2>
        </motion.div>
        <div className="max-w-[800px] mx-auto">
          {faqs.map((faq: any, i: number) => (
            <motion.div
              key={i}
              className="border-b border-dark/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <button
                className="w-full py-6 flex justify-between items-center text-left text-dark font-sans font-medium text-lg focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <span className={`text-2xl transition-transform duration-400 ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-muted text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
