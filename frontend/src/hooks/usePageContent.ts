
import { useState, useEffect } from 'react';

interface PageContent {
  title_en: string;
  title_fr: string;
  subtitle_1_en: string;
  subtitle_1_fr: string;
  subtitle_2_en: string;
  subtitle_2_fr: string;
  body_1_en: string;
  body_1_fr: string;
  body_2_en: string;
  body_2_fr: string;
  button_1_label_en: string;
  button_1_label_fr: string;
  button_1_url: string;
  button_1_enabled: number | boolean;
  button_2_label_en: string;
  button_2_label_fr: string;
  button_2_url: string;
  button_2_enabled: number | boolean;
  image_1_id_url?: string;
  image_2_id_url?: string;
  [key: string]: any;
}

export const usePageContent = (slug: string, initialContent: any) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        } else {
          setContent(initialContent);
        }
      } catch (err) {
        console.error(`Failed to fetch content for ${slug}:`, err);
        setContent(initialContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, initialContent]);

  return { content, loading };
};
