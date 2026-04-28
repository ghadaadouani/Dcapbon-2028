import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePageContent } from '../hooks/usePageContent';
import FAQ from '../components/FAQ';
import sunsetHero from '../assets/sunset.png';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';
import image7 from '../assets/image7.png';
import image8 from '../assets/image8.png';
import image9 from '../assets/image9.png';
import image10 from '../assets/image10.png';
import orangeImage from '../assets/orange.png';
import oliveImage from '../assets/olive.png';
import peppersImage from '../assets/peppers.png';
import wineImage from '../assets/wine.png';
import potteryImage from '../assets/pottery.png';
import grombaliaImage from '../assets/grombalia.png';

const Hero = ({ data }: { data?: any }) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const defaultContent = {
    fr: {
      title: "L'Art Perdu du Terroir",
      desc: "Une immersion sensorielle de 48 heures entre mer et terre, au cœur des traditions millénaires du Cap Bon. Une expérience limitée à douze artisans du goût.",
      cta: "S'inscrire à l'Expérience"
    },
    en: {
      title: "The Lost Art of Terroir",
      desc: "A 48-hour sensory immersion between sea and land, at the heart of Cap Bon's millennial traditions. An experience limited to twelve flavor artisans.",
      cta: "Register for the Experience"
    }
  };

  const t = {
      title: data ? (language === 'fr' ? data.title_fr : data.title_en) : defaultContent[language].title,
      desc: data ? (language === 'fr' ? data.subtitle_1_fr : data.subtitle_1_en) : defaultContent[language].desc,
      cta: data ? (language === 'fr' ? data.button_1_label_fr : data.button_1_label_en) : defaultContent[language].cta,
      link: data?.button_1_url || "/contact"
  };

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <img 
          src={data?.image_1_id_url || sunsetHero} 
          alt="Cap Bon Sunset" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/90 via-brand-deep/40 to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/40 via-transparent to-transparent z-1" />
      </motion.div>
      
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 text-left w-full text-white">
        <motion.h1
          className="text-white text-5xl md:text-7xl lg:text-8xl font-serif italic leading-[1.05] tracking-tight mb-8 max-w-[800px]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          dangerouslySetInnerHTML={{ __html: t.title }}
        />
        
        <motion.p
          className="text-white/80 text-lg md:text-xl font-normal max-w-[600px] mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          dangerouslySetInnerHTML={{ __html: t.desc }}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          <Link 
            to="/contact" 
            className="group relative px-10 py-5 bg-white text-brand-deep text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:text-white"
          >
            <span className="relative z-10">{t.cta}</span>
            <div className="absolute inset-0 bg-brand-red scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const ShakshoukaPeninsula = ({ data }: { data?: any }) => {
  const { language } = useLanguage();
  
  const defaultContent = {
    fr: {
      label: "Le Candidat Mondial",
      title: "Cap Bon — La Péninsule Shakshouka",
      subtitle: "Là où les continents se rencontrent à table",
      p1: "Situé à la pointe nord-est de la Tunisie, là où la Méditerranée se courbe en trois horizons ouverts, le Cap Bon est une terre de synthèse. Trois mille ans de strates culturelles s'y rencontrent : des Phéniciens et leurs oliviers aux Romains et leurs greniers à blé, des Arabes et leurs agrumes aux Andalous et leurs distillations de fleurs d'oranger.",
      p2: "Nous appelons notre terre la \"Péninsule de la Shakshouka\" — une métaphore culinaire où les ingrédients de différents continents se mélangent naturellement. Ce n'est pas seulement de l'histoire, c'est la vie quotidienne : les pêcheurs à l'aube, le séchage des piments pour l'harissa, et les oliveraies séculaires.",
      cta1: "Découvrir la Péninsule",
      cta2: "Explorer Cap Bon 2028"
    },
    en: {
      label: "The Global Candidate",
      title: "Cap Bon — The Shakshouka Peninsula",
      subtitle: "Where Continents Meet at the Table",
      p1: "At the northeastern edge of Tunisia, where the Mediterranean curves into three open horizons, lies Cap Bon—a peninsula shaped by wind, water, and centuries of exchange. For more than three thousand years, farmers, traders, and cooks have brought ingredients, techniques, and traditions from across continents.",
      p2: "We call our land the \"Shakshouka Peninsula\"—a culinary metaphor where ingredients from different continents blend naturally. It is not history alone, but the daily life of the peninsula: fishermen at dawn, families preparing couscous, and ancient olive groves with century-old traditions.",
      cta1: "Discover the Peninsula",
      cta2: "Explore Cap Bon 2028"
    }
  };

  const t = {
      label: defaultContent[language].label,
      // Hero already uses title_en/fr — this section uses subtitle_1 as its heading
      title: data ? (language === 'fr' ? (data.subtitle_1_fr || data.title_fr) : (data.subtitle_1_en || data.title_en)) : defaultContent[language].title,
      subtitle: data ? (language === 'fr' ? (data.subtitle_2_fr || data.subtitle_1_fr) : (data.subtitle_2_en || data.subtitle_1_en)) : defaultContent[language].subtitle,
      p1: data ? (language === 'fr' ? data.body_1_fr : data.body_1_en) : defaultContent[language].p1,
      p2: data ? (language === 'fr' ? data.body_2_fr : data.body_2_en) : defaultContent[language].p2,
      cta1: defaultContent[language].cta1,
      cta2: defaultContent[language].cta2
  };

  return (
    <section className="section-padding bg-brand-cream overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow"><span>{t.label}</span></div>
            <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl lg:text-6xl mb-4 text-brand-deep break-words overflow-hidden" dangerouslySetInnerHTML={{ __html: t.title }} />
                <h3 className="text-lg md:text-xl font-serif italic text-brand-forest mb-6" dangerouslySetInnerHTML={{ __html: t.subtitle }} />
            </div>
            <div className="space-y-4 text-brand-deep/70 text-base leading-relaxed mb-8 max-w-[550px] break-words overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: t.p1 }} />
              <div dangerouslySetInnerHTML={{ __html: t.p2 }} />
            </div>
            <div className="flex flex-nowrap gap-4">
              <Link to="/la-region/a-propos" className="btn btn-primary">{t.cta1}</Link>
              <Link to="/la-region/projet-candidature" className="btn btn-outline">{t.cta2}</Link>
            </div>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              className="aspect-[4/5] overflow-hidden rounded-md shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <img 
                src={image1} 
                alt="Cap Bon Aerial" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-brand-sage/30 rounded-full pointer-events-none hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

const MediterraneanReversal = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      label: "Le Changement",
      title: "Le Renversement Méditerranéen",
      subtitle: "Réappropriation de la Rive Sud",
      tertiary: "Une Nouvelle Vision du Tourisme",
      p1: "Pendant trop longtemps, le tourisme s'est limité aux complexes hôteliers tout-compris, laissant inexplorée la richesse culturelle de nos souks, de nos ateliers de poterie et de nos vergers d'agrumes. Nous inversons le regard, passant de la domination du nord de la Méditerranée aux traditions vivantes de la rive sud.",
      p2: "Notre modèle de tourisme régénératif invite les visiteurs à s'engager avec les communautés, à apprendre des producteurs et à contribuer à la préservation du patrimoine. Des rencontres authentiques qui nourrissent à la fois le visiteur et l'hôte.",
      cta1: "Notre Vision pour 2028",
      cta2: "Vivre le Tourisme Régénératif"
    },
    en: {
      label: "The Change",
      title: "The Mediterranean Reversal",
      subtitle: "Reclaiming the Southern Shore",
      tertiary: "A New Vision for Tourism",
      p1: "For too long, tourism has been confined to all-inclusive resorts, leaving the cultural richness of our souks, pottery workshops, and citrus groves unexplored. We are reversing the gaze, moving from the dominance of the northern Mediterranean to the living traditions of the southern shore.",
      p2: "Our regenerative tourism model invites visitors to engage with communities, learn from producers, and contribute to heritage preservation. Authentic encounters that nourish both the visitor and the host.",
      cta1: "Our Vision for 2028",
      cta2: "Experience Regenerative Tourism"
    }
  };

  const t = content[language];

  return (
    <section className="section-padding bg-brand-sage/10 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative order-2 md:order-1">
            <motion.div 
              className="aspect-[4/5] overflow-hidden rounded-md shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <img 
                src={image2} 
                alt="Fishing Port" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-brand-sage/30 rounded-full pointer-events-none hidden md:block" />
          </div>

          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow"><span>{t.label}</span></div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl mb-4 text-brand-deep">{t.title}</h2>
            <h3 className="text-lg md:text-xl font-serif italic text-brand-forest mb-6">{t.subtitle}</h3>
            <div className="space-y-6 text-brand-deep/70 text-base leading-relaxed mb-8 max-w-[550px]">
              <h4 className="text-brand-deep font-serif text-xl">{t.tertiary}</h4>
              <p>{t.p1}</p>
              <p>{t.p2}</p>
            </div>
            <div className="flex flex-nowrap gap-4">
              <Link to="/la-region/projet-candidature" className="btn btn-primary">{t.cta1}</Link>
              <Link to="/tourisme/itineraires" className="btn btn-outline">{t.cta2}</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const RedGoldFragrance = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      label: "Les Saveurs Cardinales",
      title: "Or Rouge et Parfum Liquide",
      subtitle: "Harissa, Huile d'Olive et Fleurs d'Agrumes",
      quote: "\"La gastronomie du Cap Bon commence par sa terre.\"",
      oliveTitle: "L'Huile d'Olive",
      oliveDesc: "Des oliveraies s'étendant vers la mer, trois millénaires de tradition. Elle apporte profondeur et richesse aux plats quotidiens, issue de techniques de pressage ancestrales préservées.",
      harissaTitle: "L'Harissa",
      harissaDesc: "L'or rouge. Des piments de fin d'été mûrissant sous le soleil, transformés en une pâte audacieuse. C'est l'exportation culinaire la plus célèbre de Tunisie, apportant chaleur et caractère.",
      citrusTitle: "Fleurs d'Agrumes",
      citrusDesc: "Un parfum de printemps qui emplit l'air. La tradition andalouse de distillation dans des alambics en cuivre parfume nos pâtisseries et nos boissons depuis des siècles.",
      cta: "Explorer Notre Terroir"
    },
    en: {
      label: "The Cardinal Flavors",
      title: "Red Gold and Liquid Fragrance",
      subtitle: "Harissa, Olive Oil, and Citrus Blossoms",
      quote: "\"The gastronomy of Cap Bon begins with its land.\"",
      oliveTitle: "Olive Oil",
      oliveDesc: "Olive groves stretching toward the sea, three millennia of tradition. It brings depth and richness to everyday dishes, born from preserved ancestral pressing techniques.",
      harissaTitle: "Harissa",
      harissaDesc: "The red gold. Late summer chili peppers ripening under the sun, transformed into a bold paste. Tunisia's most celebrated culinary export, bringing warmth and character.",
      citrusTitle: "Citrus Blossoms",
      citrusDesc: "A spring aroma filling the air. The Andalusian tradition of distillation in copper stills has perfumed our pastries and drinks for centuries.",
      cta: "Explore Our Terroir"
    }
  };

  const t = content[language];

  return (
    <section className="section-padding bg-brand-cream overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow"><span>{t.label}</span></div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl mb-4 text-brand-deep">{t.title}</h2>
            <h3 className="text-lg md:text-xl font-serif italic text-brand-forest mb-6">{t.subtitle}</h3>
            <div className="space-y-6 text-brand-deep/70 text-base leading-relaxed mb-8 max-w-[550px]">
              <p className="italic font-serif text-lg text-brand-deep leading-relaxed">{t.quote}</p>
              
              <div className="grid gap-6">
                <div>
                  <h4 className="text-brand-deep font-serif text-xl mb-1">{t.oliveTitle}</h4>
                  <p className="text-sm">{t.oliveDesc}</p>
                </div>

                <div>
                  <h4 className="text-brand-deep font-serif text-xl mb-1">{t.harissaTitle}</h4>
                  <p className="text-sm">{t.harissaDesc}</p>
                </div>

                <div>
                  <h4 className="text-brand-deep font-serif text-xl mb-1">{t.citrusTitle}</h4>
                  <p className="text-sm">{t.citrusDesc}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/gastronomie/produits-phares" className="btn btn-primary">{t.cta}</Link>
            </div>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              className="aspect-[4/5] overflow-hidden rounded-md shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <img 
                src={image5} 
                alt="Harissa Sun" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-brand-sage/30 rounded-full pointer-events-none hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

const PartnersInPurpose = ({ data }: { data?: any }) => {
  const { language } = useLanguage();

  const defaultContent = {
    fr: {
      label: "La Collaboration",
      title: "Partenaires de Sens",
      subtitle: "Construire la Vision Cap Bon 2028",
      intro: "La candidature est bâtie sur la collaboration — institutions, organisations et individus unis pour célébrer et renforcer notre héritage culinaire.",
      closing: "\"Ensemble, ces partenaires représentent la diversité du Cap Bon lui-même.\"",
      cta1: "Rencontrer Nos Partenaires",
      cta2: "Rejoindre l'Initiative",
      partners: [
        {
          name: "Sawa Taste of Tunisia",
          role: "Expériences Culinaires Immersives",
          desc: "Connecte les visiteurs aux producteurs, artisans et cuisines familiales pour un tourisme au service des communautés."
        },
        {
          name: "ONTT",
          role: "Office Régional du Tourisme",
          desc: "Promotion internationale et développement du tourisme durable pour la région Nabeul–Hammamet."
        },
        {
          name: "ATPNE",
          role: "Protection de l'Environnement",
          desc: "Expertise environnementale garantissant que la croissance touristique respecte nos paysages et écosystèmes."
        },
        {
          name: "IFMT",
          role: "Formation Touristique",
          desc: "Prépare les futurs professionnels aux arts culinaires et à la gestion hôtelière pour renforcer le capital humain."
        }
      ]
    },
    en: {
      label: "The Collaboration",
      title: "Partners in Purpose",
      subtitle: "Building the Cap Bon 2028 Vision",
      intro: "The candidacy is built on collaboration—institutions, organizations, and individuals united toward celebrating and strengthening our culinary heritage.",
      closing: "\"Together, these partners represent the diversity of Cap Bon itself.\"",
      cta1: "Meet Our Partners",
      cta2: "Join the Initiative",
      partners: [
        {
          name: "Sawa Taste of Tunisia",
          role: "Immersive Culinary Experiences",
          desc: "Connects visitors with producers, artisans, and family kitchens for tourism that serves communities."
        },
        {
          name: "ONTT",
          role: "Regional Tourism Office",
          desc: "Central international promotion and sustainable tourism development for the Nabeul–Hammamet region."
        },
        {
          name: "ATPNE",
          role: "Environmental Protection",
          desc: "Environmental expertise ensuring that tourism growth respects our landscapes and ecosystems."
        },
        {
          name: "IFMT",
          role: "Tourism Training Institute",
          desc: "Prepares future professionals in culinary arts and hospitality management to strengthen human capital."
        }
      ]
    }
  };

  const partners = data?.partners?.map(partner => ({
    name: language === 'fr' ? partner.name_fr : partner.name_en,
    role: language === 'fr' ? partner.role_fr : partner.role_en,
    desc: language === 'fr' ? partner.desc_fr : partner.desc_en
  })) || defaultContent[language].partners;

  const label = data ? (language === 'fr' ? data.partners_label_fr : data.partners_label_en) : defaultContent[language].label;
  const title = data ? (language === 'fr' ? data.partners_title_fr : data.partners_title_en) : defaultContent[language].title;
  const subtitle = data ? (language === 'fr' ? data.partners_subtitle_fr : data.partners_subtitle_en) : defaultContent[language].subtitle;
  const intro = data ? (language === 'fr' ? data.partners_intro_fr : data.partners_intro_en) : defaultContent[language].intro;
  const closing = data ? (language === 'fr' ? data.partners_closing_fr : data.partners_closing_en) : defaultContent[language].closing;
  const cta1 = data ? (language === 'fr' ? data.partners_cta1_fr : data.partners_cta1_en) : defaultContent[language].cta1;
  const cta2 = data ? (language === 'fr' ? data.partners_cta2_fr : data.partners_cta2_en) : defaultContent[language].cta2;

  const images = [
    "https://picsum.photos/seed/sawa/600/400",
    "https://picsum.photos/seed/ontt/600/400",
    "https://picsum.photos/seed/atpne/600/400",
    "https://picsum.photos/seed/ifmt/600/400"
  ];

  return (
    <section className="section-padding bg-brand-deep text-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="eyebrow justify-center"><span className="text-brand-sage">{label}</span></div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl mb-4 text-white">{title}</h2>
          <h3 className="text-lg md:text-xl font-serif italic text-white/50 mb-6">{subtitle}</h3>
          <p className="text-white/40 text-base max-w-[700px] mx-auto leading-relaxed">
            {intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-500 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="aspect-video overflow-hidden rounded-lg mb-6">
                <img src={images[i] || images[0]} alt={partner.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <h4 className="text-brand-sage font-sans text-[10px] uppercase tracking-[0.2em] mb-2">{partner.role}</h4>
              <h3 className="text-xl font-serif mb-3 text-white">{partner.name}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{partner.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/30 italic text-sm mb-8">{closing}</p>
          <div className="flex flex-nowrap justify-center gap-4">
            <Link to="/la-region/partners" className="btn btn-primary !bg-white !text-brand-deep hover:!bg-brand-sage hover:!text-white">{cta1}</Link>
            <Link to="/contact" className="btn btn-outline !border-white !text-white hover:!bg-white hover:!text-brand-deep">{cta2}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const Manifesto = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      label: "Le Manifeste",
      title: "Un Héritage Gastronomique en Mouvement",
      p1: "Cap Bon Discover n'est pas seulement un guide, c'est une célébration de l'authenticité. Nous mettons en lumière les artisans, les chefs et les producteurs qui font battre le cœur de cette péninsule unique.",
      p2: "Notre mission : préserver le savoir-faire ancestral tout en embrassant l'innovation culinaire de demain."
    },
    en: {
      label: "The Manifesto",
      title: "A Gastronomic Heritage in Motion",
      p1: "Cap Bon Discover is more than a guide; it is a celebration of authenticity. We highlight the artisans, chefs, and producers who are the heartbeat of this unique peninsula.",
      p2: "Our mission: to preserve ancestral knowledge while embracing the culinary innovation of tomorrow."
    }
  };

  const t = content[language];

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="eyebrow"><span>{t.label}</span></div>
            <h2 className="text-3xl md:text-5xl text-brand-deep mb-6">{t.title}</h2>
            <div className="text-brand-deep/70 space-y-4 text-base leading-relaxed">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
            </div>
          </motion.div>
          <motion.div
            className="relative h-[400px] md:h-[500px] bg-brand-sage/10 rounded-md overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-arabic text-[120px] md:text-[200px] text-brand-deep opacity-5 pointer-events-none z-0">تونس</div>
            <img src={image4} alt="Manifesto" className="w-full h-full object-cover relative z-10" referrerPolicy="no-referrer" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Products = ({ data }: { data?: any }) => {
  const { language } = useLanguage();

  const defaultContent = {
    fr: {
      label: "Incontournables",
      title: "Les Trésors du Terroir",
      products: [
        {
          title: "Fleurs d'Oranger",
          subtitle: "Agrumes de Nabeul",
          desc: "L'essence même du printemps, distillée avec passion dans les jardins suspendus de Nabeul.",
          badge: "Récolte 2026"
        },
        {
          title: "Harissa Artisanale",
          subtitle: "Or Rouge",
          desc: "Un équilibre parfait entre piment séché au soleil et épices secrètes, pilé à la main.",
          badge: "Premium"
        },
        {
          title: "Huile d'Olive Extra",
          subtitle: "Grombalia",
          desc: "Une pression à froid issue d'oliviers centenaires, offrant des notes herbacées uniques.",
          badge: "Bio"
        }
      ]
    },
    en: {
      label: "Essentials",
      title: "Treasures of the Terroir",
      products: [
        {
          title: "Orange Blossoms",
          subtitle: "Nabeul Citrus",
          desc: "The very essence of spring, passionately distilled in the hanging gardens of Nabeul.",
          badge: "2026 Harvest"
        },
        {
          title: "Artisanal Harissa",
          subtitle: "Red Gold",
          desc: "A perfect balance of sun-dried chili and secret spices, hand-pounded to perfection.",
          badge: "Premium"
        },
        {
          title: "Extra Virgin Olive Oil",
          subtitle: "Grombalia",
          desc: "Cold-pressed from century-old olive trees, offering unique herbaceous notes.",
          badge: "Organic"
        }
      ]
    }
  };

  const products = data?.products || defaultContent[language].products;
  const title = data ? (language === 'fr' ? data.products_title_fr : data.products_title_en) : defaultContent[language].title;
  const label = data ? (language === 'fr' ? data.products_label_fr : data.products_label_en) : defaultContent[language].label;

  const images = [
    orangeImage,
    image3,
    oliveImage
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="eyebrow"><span>{label}</span></div>
          <h2 className="text-3xl md:text-5xl text-brand-deep">{title}</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((p, i) => {
            const productTitle = language === 'fr' ? p.title_fr : p.title_en;
            const productSubtitle = language === 'fr' ? p.subtitle_fr : p.subtitle_en;
            const productDesc = language === 'fr' ? p.desc_fr : p.desc_en;
            const productBadge = language === 'fr' ? p.badge_fr : p.badge_en;
            return (
            <motion.div
              key={productTitle}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <div className="relative h-[300px] md:h-[340px] bg-brand-sage/5 rounded-md overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-deep font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 z-10 rounded shadow-sm">{productBadge}</div>
                <img src={images[i] || images[0]} alt={productTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="pt-6">
                <div className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-brand-sage mb-2">{productSubtitle}</div>
                <h3 className="text-brand-deep text-xl md:text-2xl mb-2 font-serif italic">{productTitle}</h3>
                <p className="text-brand-deep/60 text-sm leading-relaxed">{productDesc}</p>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
};

const Timeline = ({ data }: { data?: any }) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const defaultContent = {
    fr: {
      label: "L'Épopée",
      title: "8000 Ans d'Héritage",
      eras: [
        { date: '8000 BC', title: 'Néolithique', desc: 'Premières traces d\'agriculture et cueillette côtière.' },
        { date: 'VIIIe BC', title: 'Ère Punique', desc: 'Fondation de Kerkouane, culture de la vigne et de l\'olivier.' },
        { date: '146 BC', title: 'Pax Romana', desc: 'Le grenier de Rome, exportation massive d\'huile et de vin.' },
        { date: 'XVIIe', title: 'Influence Andalouse', desc: 'Introduction des agrumes et techniques d\'irrigation.' },
        { date: '2028', title: 'Futur Gastronomique', desc: 'Candidature Région Mondiale et rayonnement international.' }
      ]
    },
    en: {
      label: "The Epic",
      title: "8000 Years of Heritage",
      eras: [
        { date: '8000 BC', title: 'Neolithic', desc: 'First traces of agriculture and coastal gathering.' },
        { date: '8th C. BC', title: 'Punic Era', desc: 'Foundation of Kerkouane, cultivation of vines and olives.' },
        { date: '146 BC', title: 'Pax Romana', desc: 'The granary of Rome, massive export of oil and wine.' },
        { date: '17th C.', title: 'Andalusian Influence', desc: 'Introduction of citrus fruits and irrigation techniques.' },
        { date: '2028', title: 'Gastronomic Future', desc: 'World Region Candidacy and international influence.' }
      ]
    }
  };

  const defaultEras = defaultContent[language].eras;
  const eras = data?.timeline?.map(era => ({
    date: era.date,
    title: language === 'fr' ? era.title_fr : era.title_en,
    desc: language === 'fr' ? era.desc_fr : era.desc_en
  })) || defaultEras;

  const label = data ? (language === 'fr' ? data.timeline_label_fr : data.timeline_label_en) : defaultContent[language].label;
  const title = data ? (language === 'fr' ? data.timeline_title_fr : data.timeline_title_en) : defaultContent[language].title;

  const images = [
    image6,
    image7,
    image8,
    image9,
    image10
  ];

  const xRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-95%"]);
  const x = useSpring(xRaw, { stiffness: 50, damping: 20 });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-brand-deep">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container-custom mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="eyebrow"><span className="text-brand-sage">{label}</span></div>
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl">{title}</h2>
          </motion.div>
        </div>

        <motion.div style={{ x }} className="flex gap-12 px-8 md:px-20 w-max">
          {eras.map((era, i) => (
            <div key={era.date} className="flex-shrink-0 w-[400px] md:w-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md">
                  <motion.img 
                    src={images[i] || images[0]} 
                    alt={era.title} 
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-white">
                  <div className="font-serif text-4xl md:text-6xl text-brand-sage mb-4">{era.date}</div>
                  <h3 className="text-2xl md:text-3xl mb-4 italic font-serif">{era.title}</h3>
                  <p className="text-white/60 text-lg leading-relaxed">{era.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="absolute bottom-10 left-8 md:left-20 right-8 md:right-20 h-[1.5px] bg-white/10">
          <motion.div 
            className="h-full bg-brand-sage origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
};

const Gallery = ({ data }: { data?: any }) => {
  const { language } = useLanguage();

  const defaultContent = {
    fr: {
      label: "Instants",
      title: "Galerie de Vie",
      items: [
        { caption: 'Séchage des piments au soleil' },
        { caption: 'Vergers d\'agrumes en fleurs' },
        { caption: 'Port de Kélibia à l\'aube' },
        { caption: 'Atelier de poterie traditionnelle' },
        { caption: 'Vignobles de Grombalia' },
        { caption: 'Récolte des olives' }
      ]
    },
    en: {
      label: "Moments",
      title: "Gallery of Life",
      items: [
        { caption: 'Drying peppers in the sun' },
        { caption: 'Citrus orchards in bloom' },
        { caption: 'Kelibia port at dawn' },
        { caption: 'Traditional pottery workshop' },
        { caption: 'Grombalia vineyards' },
        { caption: 'Olive harvest' }
      ]
    }
  };

  const galleryItems = data?.gallery?.map(item => ({
    caption: language === 'fr' ? item.caption_fr : item.caption_en
  })) || defaultContent[language].items;

  const label = data ? (language === 'fr' ? data.gallery_label_fr : data.gallery_label_en) : defaultContent[language].label;
  const title = data ? (language === 'fr' ? data.gallery_title_fr : data.gallery_title_en) : defaultContent[language].title;

  const images = [
    peppersImage,
    wineImage,
    image2,
    potteryImage,
    grombaliaImage,
    oliveImage
  ];

  // Duplicate items for seamless loop
  const duplicatedItems = [...galleryItems, ...galleryItems];
  const duplicatedImages = [...images, ...images];

  return (
    <section className="py-20 bg-brand-sage/5 overflow-hidden relative">
      <div className="container-custom mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="eyebrow"><span>{label}</span></div>
          <h2 className="text-3xl md:text-5xl text-brand-deep">{title}</h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-sage/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-sage/5 to-transparent z-10 pointer-events-none" />

        <div className="overflow-x-auto no-scrollbar">
          <motion.div 
            className="flex gap-4 px-4 w-max md:w-full"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 60, 
              ease: "linear", 
              repeat: Infinity 
            }}
            whileHover={{ transition: { duration: 100 } }}
          >
            {duplicatedItems.map((item, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-[260px] md:w-[360px] aspect-[4/5] rounded-md overflow-hidden relative group"
              >
                <img 
                  src={duplicatedImages[i] || duplicatedImages[0]} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-brand-deep/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white font-serif italic text-base md:text-lg">{item.caption}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ImageStrip = () => {
  const images = [
    'https://picsum.photos/seed/s1/800/400',
    'https://picsum.photos/seed/s2/800/400',
    'https://picsum.photos/seed/s3/800/400',
    'https://picsum.photos/seed/s4/800/400',
  ];
  const duplicated = [...images, ...images];

  return (
    <section className="py-8 bg-white overflow-hidden">
      <motion.div 
        className="flex gap-4"
        animate={{ x: ["-50%", "0%"] }} // Reverse direction
        transition={{ 
          duration: 30, 
          ease: "linear", 
          repeat: Infinity 
        }}
      >
        {duplicated.map((img, i) => (
          <div key={i} className="flex-shrink-0 w-[400px] md:w-[600px] h-[300px] overflow-hidden rounded-sm group">
            <img 
              src={img} 
              alt="Strip" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" 
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
};

const AreaOfMonth = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const content = {
    fr: {
      label: "L'Endroit du Mois",
      title: "Le Fort de Kélibia",
      desc: "Dominant la Méditerranée du haut de son promontoire rocheux, le Fort de Kélibia est une sentinelle de l'histoire. Entre ses murs byzantins et ses panoramas à couper le souffle, il incarne la force et la beauté brute du Cap Bon.",
      cta: "Explorer la Citadelle"
    },
    en: {
      label: "Place of the Month",
      title: "The Kelibia Fort",
      desc: "Dominating the Mediterranean from its rocky promontory, the Kelibia Fort is a sentinel of history. Between its Byzantine walls and breathtaking panoramas, it embodies the strength and raw beauty of Cap Bon.",
      cta: "Explore the Citadel"
    }
  };

  const t = content[language];

  return (
    <section ref={ref} className="section-padding bg-cream overflow-hidden">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <motion.img 
              style={{ y, scale: 1.2 }}
              src="src/assets/image2.png" 
              alt="Kélibia" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-dark/10 pointer-events-none" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow"><span>{t.label}</span></div>
            <h2 className="text-5xl md:text-7xl mb-8">{t.title}</h2>
            <p className="text-muted text-xl leading-relaxed mb-10">
              {t.desc}
            </p>
            <Link to="/tourisme/itineraires" className="btn btn-primary">{t.cta}</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const { language } = useLanguage();
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

  return (
    <section className="section-padding bg-brand-cream container-custom px-6" ref={formRef}>
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
              <div className="flex items-center gap-4 text-brand-deep/70">
                <div className="w-10 h-10 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest"><MapPin className="w-5 h-5" /></div>
                <span className="font-sans">{language === 'fr' ? 'Cap Bon, Tunisie' : 'Cap Bon, Tunisia'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



const Home = () => {
  const { content: dynamicContent, loading } = usePageContent('home', null);

  return (
    <>
      <Hero data={dynamicContent} />
      <ShakshoukaPeninsula data={dynamicContent} />
      <MediterraneanReversal />
      <Manifesto />
      <RedGoldFragrance />
      <Timeline data={dynamicContent} />
      <AreaOfMonth />
      <Products data={dynamicContent} />
      {/* <ImageStrip /> */}
      <Gallery data={dynamicContent} />
      <FAQ data={dynamicContent} />
      <PartnersInPurpose data={dynamicContent} />
      <ContactSection />
    </>
  );
};

export default Home;
