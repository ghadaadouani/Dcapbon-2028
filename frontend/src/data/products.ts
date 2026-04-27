export interface Product {
  id: string;
  name: { en: string; fr: string };
  description: { en: string; fr: string };
  image: string;
  badge?: string;
  longDescription: { en: string; fr: string };
}

export const products: Product[] = [
  {
    id: "1",
    name: { en: "Harissa de Nabeul", fr: "Harissa de Nabeul" },
    description: {
      en: "The iconic sundried pepper paste from Cap Bon.",
      fr: "L'iconique pâte de piment séchée au soleil du Cap Bon."
    },
    image: "https://images.unsplash.com/photo-1590494056263-d8c5478417c8?auto=format&fit=crop&q=80&w=800",
    badge: "UNESCO Heritage",
    longDescription: {
      en: "Nabeul’s Harissa is a living heritage. Prepared from sundried peppers, garlic, caraway, and coriander, it represents the heat and soul of the Tunisian table.",
      fr: "L'Harissa de Nabeul est un patrimoine vivant. Préparée à partir de piments séchés au soleil, d'ail, de carvi et de coriandre, elle représente la chaleur et l'âme de la table tunisienne."
    }
  },
  {
    id: "2",
    name: { en: "Couscous", fr: "Le Couscous" },
    description: {
      en: "A social bond listed as intangible UNESCO heritage.",
      fr: "Un lien social inscrit au patrimoine immatériel de l'UNESCO."
    },
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800",
    badge: "UNESCO Heritage",
    longDescription: {
      en: "In Cap Bon, couscous is more than a dish—it’s a communal ritual. From hand-rolling semolina to the famous fish couscous of Haouaria, it is the beating heart of our gastronomy.",
      fr: "Au Cap Bon, le couscous est plus qu'un plat—c'est un rituel communautaire. Du roulage à la main de la semoule au célèbre couscous de poisson de Haouaria, c'est le cœur battant de notre gastronomie."
    }
  },
  {
    id: "3",
    name: { en: "Orange Blossom Water", fr: "Eau de fleur d'oranger" },
    description: {
      en: "The scent of Neroli captured in every spring.",
      fr: "Le parfum du Néroli capturé à chaque printemps."
    },
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800",
    longDescription: {
      en: "Derived from the 'Bigaradier' citrus blossoms, this aromatic water is central to Tunisian pastry making and cultural rituals.",
      fr: "Issue des fleurs du bigaradier, cette eau aromatique est centrale dans la pâtisserie tunisienne et les rituels culturels."
    }
  },
  {
    id: "4",
    name: { en: "Olive Oil de Grombalia", fr: "Huile d'olive de Grombalia" },
    description: {
      en: "Extra virgin gold from century-old groves.",
      fr: "L'or extra vierge des oliveraies séculaires."
    },
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbadcbaf?auto=format&fit=crop&q=80&w=800",
    badge: "PDO / AOC",
    longDescription: {
      en: "Our olive oil is produced following traditional cold-pressing methods, resulting in a unique fruity flavor that captures the Mediterranean breeze.",
      fr: "Notre huile d'olive est produite selon des méthodes traditionnelles de pressage à froid, offrant une saveur fruitée unique qui capture la brise de la Méditerranée."
    }
  },
  {
    id: "5",
    name: { en: "Grombalia Wine", fr: "Vin de Grombalia" },
    description: {
      en: "A tradition of viticulture since Phoenician times.",
      fr: "Une tradition de la viticulture depuis l'époque phénicienne."
    },
    image: "https://images.unsplash.com/photo-1594917418296-1c2069ed0cb1?auto=format&fit=crop&q=80&w=800",
    badge: "AOC",
    longDescription: {
      en: "The soils of Cap Bon have nurtured vines for millennia. Today, the wineries of Grombalia and Bou Argoub produce awarding-winning reds, whites, and the famous Tunisian rosé.",
      fr: "Les sols du Cap Bon nourrissent les vignes depuis des millénaires. Aujourd'hui, les caves de Grombalia et Bou Argoub produisent des rouges, des blancs primés et le célèbre rosé tunisien."
    }
  },
  {
    id: "6",
    name: { en: "Cap Bon Citrus", fr: "Citrus du Cap Bon" },
    description: {
      en: "The garden of Tunisia, exploding with zest.",
      fr: "Le jardin de la Tunisie, explosant de zeste."
    },
    image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800",
    longDescription: {
      en: "Maltese oranges, lemons, and clementines—Cap Bon's citrus fruits are world-renowned for their juiciness and concentrated flavor.",
      fr: "Oranges maltaises, citrons et clémentines—les agrumes du Cap Bon sont mondialement connus pour leur jutosité et leur saveur concentrée."
    }
  },
  {
    id: "7",
    name: { en: "Nabeul Pottery", fr: "Poterie de Nabeul" },
    description: {
      en: "Hand-painted ceramics carrying our colors.",
      fr: "Céramiques peintes à la main portant nos couleurs."
    },
    image: "https://images.unsplash.com/photo-1589531610484-98ae0327f27e?auto=format&fit=crop&q=80&w=800",
    longDescription: {
      en: "While not food, Nabeul pottery is the essential vessel for Cap Bon's cuisine. Every plate tells a story of Phoenician, Roman, and Andalusian influence.",
      fr: "Bien qu'il ne s'agisse pas de nourriture, la poterie de Nabeul est le récipient essentiel pour la cuisine du Cap Bon. Chaque assiette raconte une histoire d'influence phénicienne, romaine et andalouse."
    }
  },
  {
    id: "8",
    name: { en: "Cap Bon Honey", fr: "Miel du Cap Bon" },
    description: {
      en: "Floral nectar from orange and wild thyme fields.",
      fr: "Nectar floral issu des champs d'orangers et de thym sauvage."
    },
    image: "https://images.unsplash.com/photo-1585250000000-000000000000?auto=format&fit=crop&q=80&w=800",
    longDescription: {
      en: "The bees of Cap Bon feed on blossoms of citrus and native herbs like rosemary and thyme, producing a honey rich in aromatics and health benefits.",
      fr: "Les abeilles du Cap Bon se nourrissent des fleurs d'agrumes et d'herbes indigènes comme le romarin et le thym, produisant un miel riche en aromatiques et en bienfaits pour la santé."
    }
  }
];
