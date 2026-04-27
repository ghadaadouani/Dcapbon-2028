
import { query, connectDB } from '../db.ts';

const seed = async () => {
    try {
        console.log('🌱 Starting comprehensive page seed...');
        await connectDB();

        // Data from Home.tsx, Region.tsx, etc.
        const pages = [
            {
                slug: 'home',
                en: 'Home',
                fr: 'Accueil',
                order: 10,
                content: {
                    title_en: 'The Lost Art of Terroir',
                    title_fr: "L'Art Perdu du Terroir",
                    subtitle_1_en: 'A 48-hour sensory immersion between sea and land',
                    subtitle_1_fr: "Une immersion sensorielle de 48 heures entre mer et terre",
                    body_1_en: 'At the heart of Cap Bon\'s millennial traditions. An experience limited to twelve flavor artisans.',
                    body_1_fr: "Au cœur des traditions millénaires du Cap Bon. Une expérience limitée à douze artisans du goût.",
                    button_1_label_en: 'Register for the Experience',
                    button_1_label_fr: "S'inscrire à l'Expérience",
                    button_1_url: '/contact',
                    button_1_enabled: true
                }
            },
            {
                slug: 'region',
                en: 'The Region',
                fr: 'La Région',
                order: 20,
                content: {
                    title_en: 'Cap Bon — The Shakshouka Peninsula',
                    title_fr: "Cap Bon — La Péninsule Shakshouka",
                    subtitle_1_en: 'Where Continents Meet at the Table',
                    subtitle_1_fr: "Là où les continents se rencontrent à table",
                    body_1_en: 'At the northeastern edge of Tunisia, where the Mediterranean curves into three open horizons, lies Cap Bon—a peninsula shaped by wind, water, and centuries of exchange.',
                    body_1_fr: "Situé à la pointe nord-est de la Tunisie, là où la Méditerranée se courbe en trois horizons ouverts, le Cap Bon est une terre de synthèse.",
                    button_1_label_en: 'Discover the Peninsula',
                    button_1_label_fr: "Découvrir la Péninsule",
                    button_1_url: '/la-region/a-propos',
                    button_1_enabled: true
                }
            },
            {
                slug: 'candidacy',
                en: 'The Candidacy Project',
                fr: 'Projet de Candidature',
                order: 30,
                content: {
                    title_en: 'UNESCO City of Gastronomy Candidacy',
                    title_fr: "Candidature Ville Créative de Gastronomie UNESCO",
                    body_1_en: 'Cap Bon is proud to present its candidacy for the UNESCO Creative Cities Network, celebrating its unique culinary heritage.',
                    body_1_fr: "Le Cap Bon est fier de présenter sa candidature au Réseau des villes créatives de l'UNESCO, célébrant son patrimoine culinaire unique."
                }
            },
            {
                slug: 'partners',
                en: 'Partners in Purpose',
                fr: 'Partenaires de Sens',
                order: 40,
                content: {
                    title_en: 'Partners in Purpose',
                    title_fr: "Partenaires de Sens",
                    subtitle_1_en: 'Building the Cap Bon 2028 Vision',
                    subtitle_1_fr: "Construire la Vision Cap Bon 2028",
                    body_1_en: 'The candidacy is built on collaboration—institutions, organizations, and individuals united toward celebrating and strengthening our culinary heritage.',
                    body_1_fr: "La candidature est bâtie sur la collaboration — institutions, organisations et individus unis pour célébrer et renforcer notre héritage culinaire."
                }
            },
            {
                slug: 'artisanal-crafts',
                en: 'Les Arts du Cap Bon',
                fr: 'Les Arts du Cap Bon',
                order: 60,
                content: {
                    title_en: 'Artisanal Crafts of Cap Bon',
                    title_fr: "Les Arts du Cap Bon",
                    body_1_en: 'From pottery to weaving, the crafts of Cap Bon reflect a rich cultural tapestry.',
                    body_1_fr: "De la poterie au tissage, l'artisanat du Cap Bon reflète une riche mosaïque culturelle."
                }
            },
            { slug: 'itineraries', en: 'Itineraries', fr: 'Itinéraires', order: 80, content: { title_en: 'Our Itineraries', title_fr: 'Nos Itinéraires' } },
            { slug: 'accommodation', en: 'Accommodation', fr: 'Hébergement', order: 90, content: { title_en: 'Where to Stay', title_fr: 'Où Dormir' } },
            { slug: 'dining', en: 'Dining & Guest Tables', fr: 'Dining & Guest Tables', order: 100, content: { title_en: 'Dining Experience', title_fr: 'Expérience Culinaire' } },
            { slug: 'events-groups', en: 'Events & Groups', fr: 'Events & Groups', order: 110, content: { title_en: 'Events & Groups', title_fr: 'Évènements & Groupes' } },
            { slug: 'media', en: 'Media & Heritage', fr: 'Media & Patrimoine', order: 130, content: { title_en: 'Media & Heritage', title_fr: 'Média & Patrimoine' } },
            { slug: 'agenda', en: 'Creative Agenda', fr: 'Agenda Créatif', order: 140, content: { title_en: 'Creative Agenda', title_fr: 'Agenda Créatif' } },
            { slug: 'foundation', en: 'The Foundation', fr: 'La Fondation', order: 150, content: { title_en: 'The Foundation', title_fr: 'La Fondation' } },
            { slug: 'press', en: 'Press & Media', fr: 'Presse & Médias', order: 160, content: { title_en: 'Press', title_fr: 'Presse' } },
            {
                slug: 'contact',
                en: 'Contact',
                fr: 'Contact',
                order: 170,
                content: {
                    title_en: 'Get in Touch',
                    title_fr: "Contactez-nous",
                    body_1_en: 'We would love to hear from you. Reach out for experiences, partnerships, or inquiries.',
                    body_1_fr: "Nous serions ravis de vous entendre. Contactez-nous pour des expériences, des partenariats ou des demandes."
                }
            }
        ];

        // Add headers (non-editable markers)
        const headers = [
            { slug: 'gastronomy-header', en: 'Gastronomy & Terroir', fr: 'Gastronomie & Terroir', order: 50 },
            { slug: 'tourism-header', en: 'Tourism', fr: 'Tourisme', order: 70 },
            { slug: 'news-header', en: 'Events & News', fr: 'Évènements & Actualités', order: 120 }
        ];

        // Clear existing
        await query('DELETE FROM page_content');
        await query('DELETE FROM pages');

        for (const p of [...pages, ...headers]) {
            const pageResult: any = await query(
                'INSERT INTO pages (slug, menu_label_en, menu_label_fr, order_index) VALUES (?, ?, ?, ?)',
                [p.slug, p.en, p.fr, p.order]
            );
            const pageId = pageResult.insertId;

            if ('content' in p) {
                const c: any = p.content;
                await query(
                    `INSERT INTO page_content (
                        page_id, title_en, title_fr, subtitle_1_en, subtitle_1_fr, 
                        body_1_en, body_1_fr, button_1_label_en, button_1_label_fr, 
                        button_1_url, button_1_enabled
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        pageId, 
                        c.title_en || p.en, c.title_fr || p.fr,
                        c.subtitle_1_en || '', c.subtitle_1_fr || '',
                        c.body_1_en || '', c.body_1_fr || '',
                        c.button_1_label_en || '', c.button_1_label_fr || '',
                        c.button_1_url || '', c.button_1_enabled ? 1 : 0
                    ]
                );
            }
        }

        console.log('✅ Comprehensive seed completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    }
};

seed();
