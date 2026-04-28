import { query, isSqlite } from './db.ts';

export const runMigrations = async () => {
    console.log('🏗️ Running database migrations...');

    const isSql = isSqlite();
    
    // SQLite uses INTEGER PRIMARY KEY for autoincrement
    // MySQL uses INT AUTO_INCREMENT PRIMARY KEY
    const pk = isSql ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
    const longtext = isSql ? 'TEXT' : 'LONGTEXT';
    const timestamp = isSql ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';

    // Users (admin)
    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id ${pk},
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ${isSql ? 'VARCHAR(50)' : "ENUM('admin', 'superadmin')"} DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Pages
    await query(`
        CREATE TABLE IF NOT EXISTS pages (
            id ${pk},
            slug VARCHAR(255) NOT NULL UNIQUE,
            menu_label_en VARCHAR(255) NOT NULL,
            menu_label_fr VARCHAR(255) NOT NULL,
            parent_id INT NULL,
            is_visible BOOLEAN DEFAULT TRUE,
            order_index INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at ${timestamp},
            FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE SET NULL
        )
    `);

    // Page Content (Refactored to flat structure)
    // Check if we need to migrate from the old schema
    if (isSql) {
        const tableInfo: any = await query("PRAGMA table_info(page_content)");
        const hasLanguage = tableInfo.some((col: any) => col.name === 'language');
        if (hasLanguage) {
            console.log('🔄 Old page_content schema detected. Dropping for migration...');
            await query("DROP TABLE page_content");
        }
    }

    await query(`
        CREATE TABLE IF NOT EXISTS page_content (
            id ${pk},
            page_id INT NOT NULL,
            title_en TEXT,
            title_fr TEXT,
            subtitle_1_en TEXT,
            subtitle_1_fr TEXT,
            subtitle_2_en TEXT,
            subtitle_2_fr TEXT,
            subtitle_3_en TEXT,
            subtitle_3_fr TEXT,
            body_1_en ${longtext},
            body_1_fr ${longtext},
            body_2_en ${longtext},
            body_2_fr ${longtext},
            body_3_en ${longtext},
            body_3_fr ${longtext},
            body_4_en ${longtext},
            body_4_fr ${longtext},
            image_1_id INT NULL,
            image_1_alt_en TEXT,
            image_1_alt_fr TEXT,
            image_1_caption_en TEXT,
            image_1_caption_fr TEXT,
            image_2_id INT NULL,
            image_2_alt_en TEXT,
            image_2_alt_fr TEXT,
            image_2_caption_en TEXT,
            image_2_caption_fr TEXT,
            image_3_id INT NULL,
            image_3_alt_en TEXT,
            image_3_alt_fr TEXT,
            button_1_label_en TEXT,
            button_1_label_fr TEXT,
            button_1_url TEXT,
            button_1_enabled BOOLEAN DEFAULT FALSE,
            button_2_label_en TEXT,
            button_2_label_fr TEXT,
            button_2_url TEXT,
            button_2_enabled BOOLEAN DEFAULT FALSE,
            button_3_label_en TEXT,
            button_3_label_fr TEXT,
            button_3_url TEXT,
            button_3_enabled BOOLEAN DEFAULT FALSE,
            faq_label_en TEXT,
            faq_label_fr TEXT,
            faq_title_en TEXT,
            faq_title_fr TEXT,
            faqs ${longtext},
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at ${timestamp},
            FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
        )
    `);

    // Add new columns to existing page_content table (for migrations)
    try {
        const columns = isSql 
            ? (await query("PRAGMA table_info(page_content)") as any[]).map((col: any) => col.name)
            : [];
        
        if (!columns.includes('subtitle_3_en')) {
            await query(`ALTER TABLE page_content ADD COLUMN subtitle_3_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN subtitle_3_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN body_3_en ${longtext}`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN body_3_fr ${longtext}`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN body_4_en ${longtext}`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN body_4_fr ${longtext}`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN image_3_id INT NULL`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN image_3_alt_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN image_3_alt_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN button_3_label_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN button_3_label_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN button_3_url TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN button_3_enabled BOOLEAN DEFAULT FALSE`).catch(() => {});
        }

        if (!columns.includes('faq_label_en')) {
            await query(`ALTER TABLE page_content ADD COLUMN faq_label_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN faq_label_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN faq_title_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN faq_title_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN faqs ${longtext}`).catch(() => {});
        }

        if (!columns.includes('products_title_en')) {
            await query(`ALTER TABLE page_content ADD COLUMN products_title_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN products_title_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN products ${longtext}`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN gallery_title_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN gallery_title_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN gallery ${longtext}`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN timeline_title_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN timeline_title_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN timeline ${longtext}`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN partners_title_en TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN partners_title_fr TEXT`).catch(() => {});
            await query(`ALTER TABLE page_content ADD COLUMN partners ${longtext}`).catch(() => {});
        }
    } catch (e) {
        // Migrations are optional, fail silently
    }

    // Media
    await query(`
        CREATE TABLE IF NOT EXISTS media (
            id ${pk},
            filename VARCHAR(255) NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            mime_type VARCHAR(100),
            size INT,
            url VARCHAR(500),
            alt_text_en VARCHAR(255),
            alt_text_fr VARCHAR(255),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Blog Posts (Expanded with SEO)
    await query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
            id ${pk},
            slug VARCHAR(255) NOT NULL UNIQUE,
            title_en VARCHAR(255) NOT NULL,
            title_fr VARCHAR(255) NOT NULL,
            body_en ${longtext},
            body_fr ${longtext},
            cover_image_id INT NULL,
            author VARCHAR(100),
            published_at TIMESTAMP NULL,
            is_published BOOLEAN DEFAULT FALSE,
            meta_title_en VARCHAR(255),
            meta_title_fr VARCHAR(255),
            meta_desc_en TEXT,
            meta_desc_fr TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at ${timestamp}
        )
    `);

    // Contact Submissions (New)
    await query(`
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id ${pk},
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            is_archived BOOLEAN DEFAULT FALSE,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Events
    await query(`
        CREATE TABLE IF NOT EXISTS events (
            id ${pk},
            title_en VARCHAR(255) NOT NULL,
            title_fr VARCHAR(255) NOT NULL,
            description_en ${longtext},
            description_fr ${longtext},
            location VARCHAR(255),
            start_date DATETIME,
            end_date DATETIME,
            cover_image_id INT NULL,
            is_published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at ${timestamp},
            FOREIGN KEY (cover_image_id) REFERENCES media(id) ON DELETE SET NULL
        )
    `);

    // Media Hub
    await query(`
        CREATE TABLE IF NOT EXISTS media_hub (
            id ${pk},
            title_en VARCHAR(255) NOT NULL,
            title_fr VARCHAR(255) NOT NULL,
            file_url VARCHAR(500),
            category VARCHAR(50),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Menu Items
    await query(`
        CREATE TABLE IF NOT EXISTS menu_items (
            id ${pk},
            label_en VARCHAR(255) NOT NULL,
            label_fr VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            parent_id INT NULL,
            order_index INT DEFAULT 0,
            is_visible BOOLEAN DEFAULT TRUE,
            is_clickable BOOLEAN DEFAULT TRUE,
            updated_at ${timestamp},
            FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE SET NULL
        )
    `);


    await query(`
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            name_en VARCHAR(255) NOT NULL,
            name_fr VARCHAR(255) NOT NULL,
            description_en TEXT,
            description_fr TEXT,
            long_description_en TEXT,
            long_description_fr TEXT,
            badge VARCHAR(100),
            cover_image_id INT,
            order_index INT DEFAULT 0,
            is_published TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cover_image_id) REFERENCES media(id) ON DELETE SET NULL
        )
    `);
    console.log('✅ Migrations completed');

    // Seed initial data if empty or incomplete
    const pageCount: any = await query('SELECT COUNT(*) as count FROM pages');
    if (pageCount[0].count < 10) {
        console.log('🌱 Seeding/Resetting initial content...');
        // Clear if incomplete to avoid unique constraint issues on slugs during re-seed
        await query('DELETE FROM page_content');
        await query('DELETE FROM pages');
        
        const initialPages = [
            { slug: 'home', en: 'Home', fr: 'Accueil', order: 10 },
            { slug: 'region', en: 'The Region', fr: 'La Région', order: 20 },
            { slug: 'candidacy', en: 'The Candidacy Project', fr: 'Projet de Candidature', order: 30 },
            { slug: 'partners', en: 'Partners in Purpose', fr: 'Nos Partenaires', order: 40 },
            { slug: 'gastronomy-header', en: 'Gastronomy & Terroir', fr: 'Gastronomie & Terroir', order: 50, is_visible: true },
            { slug: 'artisanal-crafts', en: 'Les Arts du Cap Bon', fr: 'Les Arts du Cap Bon', order: 60 },
            { slug: 'tourism-header', en: 'Tourism', fr: 'Tourisme', order: 70 },
            { slug: 'itineraries', en: 'Itineraries', fr: 'Itinéraires', order: 80 },
            { slug: 'accommodation', en: 'Accommodation', fr: 'Hébergement', order: 90 },
            { slug: 'dining', en: 'Dining & Guest Tables', fr: 'Tables d\'Hôtes', order: 100 },
            { slug: 'events-groups', en: 'Events & Groups', fr: 'MICE & Groupes', order: 110 },
            { slug: 'news-header', en: 'Events & News', fr: 'Évènements & Actualités', order: 120 },
            { slug: 'blog', en: 'Blog / News', fr: 'Actualités', order: 130 },
            { slug: 'agenda', en: 'Agenda / Festivals', fr: 'Agenda cultural', order: 140 },
            { slug: 'media', en: 'Media', fr: 'Médias', order: 150 },
            { slug: 'gallery', en: 'Gallery', fr: 'Galerie', order: 160 },
            { slug: 'contact', en: 'Contact', fr: 'Contact', order: 170 },
        ];

        for (const p of initialPages) {
            const pageResult: any = await query(
                'INSERT INTO pages (slug, menu_label_en, menu_label_fr, order_index) VALUES (?, ?, ?, ?)',
                [p.slug, p.en, p.fr, p.order]
            );
            const pageId = pageResult.insertId;

            await query(
                `INSERT INTO page_content (
                    page_id, title_en, title_fr, body_1_en, body_1_fr
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    pageId, 
                    p.en, p.fr, 
                    `Welcome to the ${p.en} page.`, 
                    `Bienvenue sur la page ${p.fr}.`
                ]
            );
        }
        
        console.log('✅ Seed completed');
    }
};
