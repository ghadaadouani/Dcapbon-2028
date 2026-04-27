export interface Event {
  id: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  location: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate?: string;
  category: "gastronomy" | "culture" | "nature" | "international";
  image: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: { 
      en: "Orange Blossom Festival", 
      fr: "Festival des Fleurs d'Oranger" 
    },
    description: {
      en: "A celebration of Nabeul's iconic orange blossom (Neroli) with live distillation workshops.",
      fr: "Une célébration de l'emblématique fleur d'oranger de Nabeul avec des ateliers de distillation."
    },
    location: "Nabeul",
    startDate: "2026-04-15",
    endDate: "2026-04-18",
    category: "gastronomy",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "2",
    title: { 
      en: "Harissa Festival", 
      fr: "Festival de l'Harissa" 
    },
    description: {
      en: "The ultimate gathering for chili lovers, featuring the world-famous Harissa of Nabeul.",
      fr: "Le rassemblement ultime pour les amateurs de piment, mettant en vedette l'Harissa de Nabeul."
    },
    location: "Nabeul",
    startDate: "2026-10-10",
    endDate: "2026-10-12",
    category: "gastronomy",
    image: "https://images.unsplash.com/photo-1590494056263-d8c5478417c8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "3",
    title: { 
      en: "Hammamet International Festival", 
      fr: "Festival International de Hammamet" 
    },
    description: {
      en: "An annual multidisciplinary arts festival held in Hammamet's open-air theater.",
      fr: "Un festival annuel des arts multidisciplinaires tenu dans le théâtre de plein air de Hammamet."
    },
    location: "Hammamet",
    startDate: "2026-07-20",
    endDate: "2026-08-30",
    category: "culture",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "4",
    title: { 
      en: "Grape Festival", 
      fr: "Festival de la Vigne" 
    },
    description: {
      en: "A celebration of the harvest in Grombalia, the wine capital of Cap Bon.",
      fr: "Une célébration de la vendange à Grombalia, la capitale du vin du Cap Bon."
    },
    location: "Grombalia",
    startDate: "2026-08-15",
    endDate: "2026-08-20",
    category: "gastronomy",
    image: "https://images.unsplash.com/photo-1594917418296-1c2069ed0cb1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "5",
    title: { 
      en: "Pepper Festival", 
      fr: "Festival du Piment" 
    },
    description: {
      en: "Menzel Horr's annual tribute to the local pepper varieties and sun-drying traditions.",
      fr: "Hommage annuel de Menzel Horr aux variétés de piment locales et aux traditions de séchage au soleil."
    },
    location: "Menzel Horr",
    startDate: "2026-08-25",
    endDate: "2026-08-28",
    category: "gastronomy",
    image: "https://images.unsplash.com/photo-1589531610484-98ae0327f27e?auto=format&fit=crop&q=80&w=800"
  }
];
