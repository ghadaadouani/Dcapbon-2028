export interface NewsItem {
  id: string;
  title: { fr: string; en: string };
  date: { fr: string; en: string };
  category: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  content: { fr: string; en: string };
  image: string;
}

export interface EventItem {
  id: string;
  title: { fr: string; en: string };
  date: string; // ISO format for filtering
  location: { fr: string; en: string };
  description: { fr: string; en: string };
  image: string;
}

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: {
      fr: "Le Cap Bon officiellement candidat pour 2028",
      en: "Cap Bon Officially Candidate for 2028"
    },
    date: {
      fr: "12 Mars 2026",
      en: "March 12, 2026"
    },
    category: {
      fr: "Candidature",
      en: "Candidacy"
    },
    excerpt: {
      fr: "Le dossier de candidature a été déposé auprès de l'IGCAT, marquant une étape historique pour la région.",
      en: "The candidacy file has been submitted to IGCAT, marking a historic milestone for the region."
    },
    content: {
      fr: "C'est un moment de fierté pour tous les habitants du Cap Bon. Le dossier de candidature pour le titre de Région Mondiale de Gastronomie 2028 a été officiellement déposé. Ce projet ambitieux vise à mettre en valeur notre patrimoine culinaire unique, nos produits du terroir et le savoir-faire de nos artisans.",
      en: "It is a moment of pride for all residents of Cap Bon. The candidacy file for the title of World Region of Gastronomy 2028 has been officially submitted. This ambitious project aims to highlight our unique culinary heritage, our local products, and the expertise of our artisans."
    },
    image: "https://picsum.photos/seed/news1/800/600"
  },
  {
    id: '2',
    title: {
      fr: "Festival des Agrumes à Nabeul : Un succès retentissant",
      en: "Citrus Festival in Nabeul: A Resounding Success"
    },
    date: {
      fr: "5 Avril 2026",
      en: "April 5, 2026"
    },
    category: {
      fr: "Événement",
      en: "Event"
    },
    excerpt: {
      fr: "Des milliers de visiteurs ont célébré la récolte des fleurs d'oranger lors de la 15ème édition du festival.",
      en: "Thousands of visitors celebrated the orange blossom harvest during the 15th edition of the festival."
    },
    content: {
      fr: "Le festival annuel des agrumes de Nabeul a attiré une foule record cette année. Les rues de la ville étaient embaumées par le parfum du néroli, tandis que les artisans distillaient l'eau de fleur d'oranger sous les yeux des visiteurs émerveillés.",
      en: "The annual citrus festival in Nabeul attracted a record crowd this year. The city streets were perfumed with the scent of neroli, while artisans distilled orange blossom water before the eyes of amazed visitors."
    },
    image: "https://picsum.photos/seed/news2/800/600"
  },
  {
    id: '3',
    title: {
      fr: "Nouveau label pour l'Huile d'Olive de Grombalia",
      en: "New Label for Grombalia Olive Oil"
    },
    date: {
      fr: "20 Avril 2026",
      en: "April 20, 2026"
    },
    category: {
      fr: "Terroir",
      en: "Local Products"
    },
    excerpt: {
      fr: "Une reconnaissance internationale qui garantit l'origine et la qualité supérieure de notre or liquide.",
      en: "International recognition that guarantees the origin and superior quality of our liquid gold."
    },
    content: {
      fr: "L'huile d'olive de Grombalia vient de recevoir une Appellation d'Origine Contrôlée (AOC). Cette distinction vient récompenser des années de travail acharné des oléiculteurs de la région pour maintenir des standards de qualité exceptionnels.",
      en: "Grombalia olive oil has just received a Controlled Designation of Origin (AOC). This distinction rewards years of hard work by the region's olive growers to maintain exceptional quality standards."
    },
    image: "https://picsum.photos/seed/news3/800/600"
  }
];

export const eventItems: EventItem[] = [
  {
    id: '1',
    title: {
      fr: "Atelier de Poterie Traditionnelle",
      en: "Traditional Pottery Workshop"
    },
    date: "2026-05-15",
    location: {
      fr: "Nabeul",
      en: "Nabeul"
    },
    description: {
      fr: "Apprenez les techniques ancestrales de façonnage de l'argile avec les maîtres potiers de Nabeul.",
      en: "Learn ancestral clay shaping techniques with the master potters of Nabeul."
    },
    image: "https://picsum.photos/seed/event1/800/600"
  },
  {
    id: '2',
    title: {
      fr: "Dégustation de Vins de Kurubis",
      en: "Kurubis Wine Tasting"
    },
    date: "2026-06-10",
    location: {
      fr: "Korba",
      en: "Korba"
    },
    description: {
      fr: "Une soirée exclusive pour découvrir les meilleurs crus de la région dans un cadre idyllique.",
      en: "An exclusive evening to discover the region's best vintages in an idyllic setting."
    },
    image: "https://picsum.photos/seed/event2/800/600"
  },
  {
    id: '3',
    title: {
      fr: "Randonnée Gourmande à Haouaria",
      en: "Gourmet Hike in Haouaria"
    },
    date: "2026-06-25",
    location: {
      fr: "El Haouaria",
      en: "El Haouaria"
    },
    description: {
      fr: "Une marche entre mer et montagne ponctuée de haltes dégustation chez les producteurs locaux.",
      en: "A walk between sea and mountain punctuated by tasting stops at local producers."
    },
    image: "https://picsum.photos/seed/event3/800/600"
  }
];
