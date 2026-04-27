export type GalleryCategory = "Food" | "Landscape" | "Artisanat" | "Festivals" | "People";

export interface GalleryItem {
  id: string;
  src: string;
  alt: { en: string; fr: string };
  category: GalleryCategory;
  type: "image" | "video";
  videoUrl?: string; // YouTube/Vimeo
}

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1590494056263-d8c5478417c8?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Cap Bon Sunset with peppers", fr: "Coucher de soleil au Cap Bon avec des piments" },
    category: "Food",
    type: "image"
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Orange blossom distillation", fr: "Distillation de fleurs d'oranger" },
    category: "Artisanat",
    type: "image"
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Traditional Couscous", fr: "Couscous Traditionnel" },
    category: "Food",
    type: "image"
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Mediterranean coast at Haouaria", fr: "Côte méditerranéenne à Haouaria" },
    category: "Landscape",
    type: "image"
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1594917418296-1c2069ed0cb1?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Grombalia Vineyards", fr: "Vignobles de Grombalia" },
    category: "Landscape",
    type: "image"
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1589531610484-98ae0327f27e?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Pottery artisan in Nabeul", fr: "Artisan potier à Nabeul" },
    category: "Artisanat",
    type: "image"
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Hammamet Festival performance", fr: "Performance au Festival de Hammamet" },
    category: "Festivals",
    type: "image"
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=1200",
    alt: { en: "Tunisian Fisherman", fr: "Pêcheur Tunisien" },
    category: "People",
    type: "image"
  }
];
