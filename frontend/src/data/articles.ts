export interface Article {
  id: string;
  slug: string;
  title: { en: string; fr: string };
  excerpt: { en: string; fr: string };
  content: { en: string; fr: string };
  category: "Gastronomy" | "Culture" | "Tourism" | "Environment" | "News";
  date: string;
  coverImage: string;
  author: string;
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "harissa-story-cap-bon",
    title: {
      en: "Nabeul Harissa: The Red Gold of Cap Bon",
      fr: "L'Harissa de Nabeul : L'Or Rouge du Cap Bon"
    },
    excerpt: {
      en: "Discover the history and ancestral traditions behind the making of authentic Harissa from Nabeul.",
      fr: "Découvrez l'histoire et les traditions ancestrales derrière la fabrication de l'authentique Harissa de Nabeul."
    },
    content: {
      en: "In the heart of Cap Bon, the sun-drenched fields of Nabeul produce a treasure like no other: Harissa. More than just a condiment, it is a symbol of our identity...",
      fr: "Au cœur du Cap Bon, les champs ensoleillés de Nabeul produisent un trésor unique : l'Harissa. Plus qu'un simple condiment, c'est un symbole de notre identité..."
    },
    category: "Gastronomy",
    date: "2026-03-15",
    coverImage: "https://images.unsplash.com/photo-1590494056263-d8c5478417c8?auto=format&fit=crop&q=80&w=800",
    author: "Sawa Taste Team"
  },
  {
    id: "2",
    slug: "orange-blossom-distillation",
    title: {
      en: "The Fragrant Secret: Orange Blossom Distillation",
      fr: "Le Secret Parfumé : La Distillation des Fleurs d'Oranger"
    },
    excerpt: {
      en: "Every spring, the air in Nabeul fills with the delicate scent of Neroli. Explore this unique tradition.",
      fr: "Chaque printemps, l'air de Nabeul s'embaume du parfum délicat du Néroli. Explorez cette tradition unique."
    },
    content: {
      en: "The distillation of orange blossom water is a rite of passage in Cap Bon families. Using ancestral copper stills, we extract the essence of spring...",
      fr: "La distillation de l'eau de fleur d'oranger est un rite de passage dans les familles du Cap Bon. Utilisant des alambics en cuivre ancestraux, nous extrayons l'essence du printemps..."
    },
    category: "Culture",
    date: "2026-04-05",
    coverImage: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800",
    author: "Culture Heritage"
  },
  {
    id: "3",
    slug: "couscous-unesco-tradition",
    title: {
      en: "Couscous: A UNESCO Heritage on Our Tables",
      fr: "Le Couscous : Un Patrimoine UNESCO sur nos Tables"
    },
    excerpt: {
      en: "Learn why Cap Bon couscous is a central pillar of our candidacy and its global recognition.",
      fr: "Découvrez pourquoi le couscous du Cap Bon est un pilier central de notre candidature et sa reconnaissance mondiale."
    },
    content: {
      en: "Couscous is not just a dish; it's a social bond. In Cap Bon, we have perfected the art of handmade semolina, locally sourced vegetables, and fresh Mediterranean fish...",
      fr: "Le couscous n'est pas seulement un plat ; c'est un lien social. Au Cap Bon, nous avons perfectionné l'art de la semoule faite main, des légumes locaux et du poisson frais..."
    },
    category: "Gastronomy",
    date: "2026-04-20",
    coverImage: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800",
    author: "Lamia Temimi"
  },
  {
    id: "4",
    slug: "sicilian-tunisian-history",
    title: {
      en: "Waiters of the Mediterranean: The Sicilian Influence",
      fr: "Les Serveurs de la Méditerranée : L'Influence Sicilienne"
    },
    excerpt: {
      en: "Exploring the shared history and culinary exchanges between Sicily and the Cap Bon peninsula.",
      fr: "Exploration de l'histoire partagée et des échanges culinaires entre la Sicile et la péninsule du Cap Bon."
    },
    content: {
      en: "Cap Bon has always been a bridge. The Sicilian community in Tunisia left a lasting mark on our architecture, our language, and especially our seafood recipes...",
      fr: "Le Cap Bon a toujours été un pont. La communauté sicilienne en Tunisie a laissé une empreinte durable sur notre architecture, notre langue et surtout nos recettes de fruits de mer..."
    },
    category: "Culture",
    date: "2026-05-01",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    author: "Historian Corner"
  }
];
