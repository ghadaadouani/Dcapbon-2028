import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const ArtisanalCrafts = () => {
  const { language, t } = useLanguage();

  const content = {
    en: {
      heroTitle: "The Artisanal Crafts",
      heroSubtitle: "Handmade Heritage of Cap Bon",
      heroDesc: "In Cap Bon, our gastronomy is inseparable from the hands that shape its containers and the rituals that define its rhythm. Discover the ancestral arts that give our terroir its soul.",
      blocks: [
        {
          title: "The Vessel as an Active Ingredient",
          subtitle1: "The Science of Porous Earthenware",
          subtitle2: "Urban Rhythms and Leather-Hard Clay",
          body: "In Cap Bon, pottery is never just a passive container; it is an active participant in our gastronomy. If our fiery Harissa represents the content, the clay of Nabeul represents the essential container. The thermal physics of our porous earthenware are unparalleled: these traditional vessels breathe, regulating heat perfectly to keep olive oil cool and harissa stable.\n\nWalking through Nabeul, you witness an urban rhythm dictated by earth and sun. The city's sidewalks transform into drying racks, where children expertly dodge rows of \"leather-hard\" clay pots on their way to school. This mastery of earth gives birth to our most crucial culinary tools, such as the Couscoussier (the two-part pot essential for steaming our heritage grains) and our flat, wide clay dishes used to bake the authentic Tunisian Tajine—a golden, oven-baked egg and herb crust that is entirely distinct from the Moroccan stew. Metal can cook our food, but only Cap Bon's clay can give it its earthy soul.",
          btns: ["Discover the Potter's Trail", "Shop Authentic Nabeul Ceramics"]
        },
        {
          title: "The Alchemists of the Orange Blossom",
          subtitle1: "Capturing the Liquid Fragrance",
          subtitle2: "The Seven Historic Distilleries",
          body: "Every spring, as March turns into April, the air across the peninsula undergoes a radical transformation. Cap Bon becomes a massive, open-air perfumery. This is the season of the orange blossom, and our artisans become true alchemists. Utilizing the traditional copper Alembic—a distillation apparatus brought to our shores by Andalusian refugees—our craftsmen capture the very essence of the region in a matter of a 48-hour window.\n\nCurrently, seven active historic distilleries work day and night to transform the bitter orange blossoms into Mā’ zahar (orange blossom water) and Mā’ ward (rose water). This \"liquid fragrance\" is not merely a perfume; it is a foundational pillar of our culinary identity, used to flavor our celebratory sweets like the Assida (sweet porridge) and the Makroudh (date-filled semolina pastry). To witness the fires burning beneath the copper stills is to see centuries of Andalusian and Tunisian reciprocity distilled into a single, perfect drop of liquid light.",
          btns: ["Walk the Aromatic Trail in April", "Learn the Distillation Process"]
        },
        {
          title: "Pounding the Red Gold",
          subtitle1: "The 15th of May Harvest",
          subtitle2: "The Communal Rhythm of the Mehraz",
          body: "The creation of our signature \"Red Gold\"—Harissa—is an art form that demands both patience and physical strength. The process officially begins with the traditional pepper harvest on the 15th of May. After the vibrant red chilies are meticulously strung together and left to dry under the intense Mediterranean sun, the true craft begins.\n\nOur Harissa is not processed in factories; it is born in the Mehraz. This traditional, heavy stone or copper mortar is the heartbeat of the Cap Bon kitchen. Pounding the sun-dried peppers with garlic, caraway, and coriander is a communal ritual, often shared among women. The rhythmic thud of the Mehraz echoing through the courtyards is the sound of our heritage being preserved. Protected today by Geographical Indications (GI), the art of authentic Harissa-making is passed down from mother to daughter, ensuring that the fiery soul of the Shakshouka Peninsula remains untouched by industrial shortcuts.",
          btns: ["Join the October Harissa Festival", "Book a Harissa Masterclass"]
        },
        {
          title: "The Guardians of Grain and Fiber",
          subtitle1: "Hand-Rolling the White Couscous",
          subtitle2: "The Hassira and the Needlework of Hammamet",
          body: "The most intricate arts of Cap Bon require no tools at all—only the skilled hands of our women. Within the GDA (Women’s Agricultural Development Groups), the art of hand-rolling semolina grains to create perfect, uniform couscous is a living tradition. Before it ever reaches the couscoussier, the grain is painstakingly rolled, sifted, and dried. For celebrations, these hands prepare the legendary Couscous Abyad (White Couscous), an architectural masterpiece adorned with dates, sugar, and exactly one hundred eggs.\n\nBeyond the kitchen, these hands also weave the environment into daily life. Using native Alfa grass, artisans weave the traditional Hassira (woven mats) that line our homes and mosques. Meanwhile, groups like the \"Ambassadrices de Hammamet\" act as dual-guardians: they fiercely protect complex culinary recipes like Osbane Shayih (dried tripe) while simultaneously preserving the region's delicate, ancestral needlework and embroidery. These women are the silent architects of our cultural survival.",
          btns: ["Meet the Ambassadrices de Hammamet", "Support the GDA Artisan Cooperatives"]
        }
      ]
    },
    fr: {
      heroTitle: "Les Arts du Cap Bon",
      heroSubtitle: "Héritage Artisanal du Cap Bon",
      heroDesc: "Au Cap Bon, notre gastronomie est inséparable des mains qui façonnent ses contenants et des rituels qui définissent son rythme. Découvrez les arts ancestraux qui donnent une âme à notre terroir.",
      blocks: [
        {
          title: "Le récipient comme ingrédient actif",
          subtitle1: "La science de la faïence poreuse",
          subtitle2: "Rythmes urbains et argile « cuir »",
          body: "Au Cap Bon, la poterie n'est jamais un simple contenant passif ; elle participe activement à notre gastronomie. Si notre Harissa ardente représente le contenu, l'argile de Nabeul représente le contenant essentiel. La physique thermique de notre faïence poreuse est inégalée : ces récipients traditionnels respirent, régulant parfaitement la chaleur pour garder l'huile d'olive fraîche et la harissa stable.\n\nEn marchant dans Nabeul, on assiste à un rythme urbain dicté par la terre et le soleil. Les trottoirs de la ville se transforment en séchoirs, où les enfants esquivent habilement les rangées de pots d'argile « cuir » sur le chemin de l'école. Cette maîtrise de la terre donne naissance à nos outils culinaires les plus cruciaux, comme le Couscoussier (le pot en deux parties indispensable à la cuisson à la vapeur de nos grains d'héritage) et nos plats d'argile plats et larges utilisés pour cuire l'authentique Tajine tunisien — une croûte d'œufs et d'herbes dorée et cuite au four qui est tout à fait distincte du ragoût marocain. Le métal peut cuire nos aliments, mais seule l'argile du Cap Bon peut leur donner leur âme terreuse.",
          btns: ["Découvrir la route des potiers", "Acheter des céramiques de Nabeul"]
        },
        {
          title: "Les alchimistes de la fleur d'oranger",
          subtitle1: "Capturer le parfum liquide",
          subtitle2: "Les sept distilleries historiques",
          body: "Chaque printemps, alors que mars cède la place à avril, l'air à travers la péninsule subit une transformation radicale. Le Cap Bon devient une immense parfumerie à ciel ouvert. C'est la saison de la fleur d'oranger, et nos artisans deviennent de véritables alchimistes. Utilisant l'alambic traditionnel en cuivre — un appareil de distillation apporté sur nos côtes par les réfugiés andalous — nos artisans capturent l'essence même de la région en l'espace de 48 heures.\n\nActuellement, sept distilleries historiques actives travaillent jour et nuit pour transformer les fleurs d'oranger amer en Mā' zahar (eau de fleur d'oranger) et Mā' ward (eau de rose). Ce « parfum liquide » n'est pas seulement un parfum ; c'est un pilier fondamental de notre identité culinaire, utilisé pour aromatiser nos douceurs festives comme l'Assida (bouillie sucrée) et le Makroudh (pâtisserie à la semoule fourrée de dattes). Témoigner des feux qui brûlent sous les alambics en cuivre, c'est voir des siècles de réciprocité andalouse et tunisienne distillés dans une seule goutte parfaite de lumière liquide.",
          btns: ["Suivre la route aromatique en avril", "Apprendre le processus de distillation"]
        },
        {
          title: "Piler l'or rouge",
          subtitle1: "La récolte du 15 mai",
          subtitle2: "Le rythme communal du Mehraz",
          body: "La création de notre signature « Or Rouge » — la Harissa — est une forme d'art qui exige à la fois patience et force physique. Le processus commence officiellement avec la récolte traditionnelle des piments le 15 mai. Une fois que les piments rouges vibrants sont méticuleusement enfilés et laissés à sécher sous le soleil intense de la Méditerranée, le véritable métier commence.\n\nNotre Harissa n'est pas transformée en usine ; elle est née dans le Mehraz. Ce mortier traditionnel et lourd, en pierre ou en cuivre, est le cœur battant de la cuisine du Cap Bon. Piler les piments séchés au soleil avec de l'ail, du carvi et de la coriandre est un rituel communautaire, souvent partagé entre femmes. Le bruit sourd et rythmé du Mehraz résonnant dans les cours est le son de notre patrimoine préservé. Aujourd'hui protégé par des Indications Géographiques (IG), l'art de la fabrication authentique de la harissa se transmet de mère en fille, garantissant que l'âme ardente de la péninsule de la Shakshouka reste intacte face aux raccourcis industriels.",
          btns: ["Rejoindre le festival de la Harissa", "Réserver un cours de Harissa"]
        },
        {
          title: "Les gardiennes du grain et de la fibre",
          subtitle1: "Rouler le couscous blanc à la main",
          subtitle2: "La Hassira et les travaux d'aiguille de Hammamet",
          body: "Les arts les plus complexes du Cap Bon ne nécessitent aucun outil — seulement les mains habiles de nos femmes. Au sein des GDA (Groupements de Développement Agricole des femmes), l'art de rouler à la main les grains de semoule pour créer un couscous parfait et uniforme est une tradition vivante. Avant d'atteindre le couscoussier, le grain est minutieusement roulé, tamisé et séché. Pour les célébrations, ces mains préparent le légendaire Couscous Abyad (Couscous blanc), un chef-d'œuvre architectural orné de dattes, de sucre et d'exactement cent œufs.\n\nAu-delà de la cuisine, ces mains tissent également l'environnement dans la vie quotidienne. En utilisant l'alfa indigène, les artisans tissent la Hassira traditionnelle (nattes tissées) qui tapissent nos maisons et nos mosquées. Pendant ce temps, des groupes comme les « Ambassadrices de Hammamet » agissent comme de doubles gardiens : ils protègent farouchement des recettes culinaires complexes comme l'Osbane Shayih (tripes séchées) tout en préservant simultanément les travaux d'aiguille et les broderies ancestrales délicates de la région. Ces femmes sont les architectes silencieuses de notre survie culturelle.",
          btns: ["Rencontrer les Ambassadrices", "Soutenir les GDA"]
        }
      ]
    }
  };

  const t_page = content[language];

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      {/* Editorial Intro */}
      <section className="bg-brand-deep pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800"
            className="w-full h-full object-cover"
            alt="Craft texture"
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-brand-sage text-xs font-bold uppercase tracking-[0.3em] mb-6">
              {t('nav.gastronomy')}
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-serif italic mb-8 leading-tight">
              {t_page.heroTitle}
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-sans leading-relaxed italic">
              {t_page.heroDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Blocks */}
      <section className="container-custom px-6 mt-20">
        <div className="space-y-32">
          {t_page.blocks.map((block, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={index % 2 === 0 ? "lg:order-1" : "lg:order-2"}
              >
                <div className="mb-8">
                  <h2 className="text-brand-deep text-3xl md:text-5xl font-serif italic mb-4 leading-tight">
                    {block.title}
                  </h2>
                  <div className="flex flex-col gap-1">
                    <span className="text-brand-red text-xs font-bold uppercase tracking-[0.2em]">
                      {block.subtitle1}
                    </span>
                    <span className="text-brand-forest text-xs font-bold uppercase tracking-[0.2em]">
                      {block.subtitle2}
                    </span>
                  </div>
                </div>
                <div className="text-brand-deep/80 text-base md:text-lg leading-relaxed space-y-6 mb-10">
                  {block.body.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="btn btn-primary">{block.btns[0]}</button>
                  <button className="btn btn-outline">{block.btns[1]}</button>
                </div>
              </motion.div>

              {/* Image Placeholders */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
              >
                <div className="aspect-[4/5] bg-brand-sage/10 rounded-xl overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                    <span className="text-brand-deep/30 font-serif italic text-sm">
                      {index === 0 ? "Hands centering clay" : index === 1 ? "Mā’ zahar drop from Alembic" : index === 2 ? "Mehraz with red chilies" : "Hands rolling semolina"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-brand-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="aspect-[4/5] bg-brand-forest/10 rounded-xl overflow-hidden relative group translate-y-8 sm:translate-y-12">
                   <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                    <span className="text-brand-deep/30 font-serif italic text-sm">
                      {index === 0 ? "Couscoussiers drying" : index === 1 ? "Baskets of orange blossoms" : index === 2 ? "Teaching next generation" : "Weaving Hassira mat"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-brand-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArtisanalCrafts;
