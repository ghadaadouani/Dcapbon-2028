import express from 'express';
import { authMiddleware, login } from './auth.ts';
import { query } from './db.ts';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// AUTH
router.post('/auth/login', login);
router.get('/auth/me', authMiddleware, (req: any, res) => res.json(req.user));

// STATS
router.get('/admin/stats', authMiddleware, async (req, res) => {
    try {
        const getCount = (r: any) => Array.isArray(r) ? (r[0]?.count ?? 0) : (r?.count ?? 0);
        const [pages, blogPosts, publishedPosts, mediaFiles, events, publishedEvents, submissions, unreadSubmissions, recentSubmissions, recentPosts] = await Promise.all([
            query('SELECT COUNT(*) as count FROM pages'),
            query('SELECT COUNT(*) as count FROM blog_posts'),
            query('SELECT COUNT(*) as count FROM blog_posts WHERE is_published = 1'),
            query('SELECT COUNT(*) as count FROM media'),
            query('SELECT COUNT(*) as count FROM events'),
            query('SELECT COUNT(*) as count FROM events WHERE is_published = 1'),
            query('SELECT COUNT(*) as count FROM contact_submissions WHERE is_archived = 0'),
            query('SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = 0 AND is_archived = 0'),
            query('SELECT name, email, submitted_at FROM contact_submissions WHERE is_archived = 0 ORDER BY submitted_at DESC LIMIT 5'),
            query('SELECT title_en, slug, is_published, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 5'),
        ]);
        res.json({
            pages: getCount(pages), blogPosts: getCount(blogPosts), publishedPosts: getCount(publishedPosts),
            draftPosts: getCount(blogPosts) - getCount(publishedPosts), mediaFiles: getCount(mediaFiles),
            events: getCount(events), publishedEvents: getCount(publishedEvents),
            submissions: getCount(submissions), unreadSubmissions: getCount(unreadSubmissions),
            recentSubmissions: Array.isArray(recentSubmissions) ? recentSubmissions : [],
            recentPosts: Array.isArray(recentPosts) ? recentPosts : [],
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch stats: ' + error.message });
    }
});

// CONTACT
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' });
    try {
        await query('INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
        res.status(201).json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Failed to save submission' }); }
});

router.get('/contact/submissions', authMiddleware, async (req, res) => {
    const { filter } = req.query;
    let sql = 'SELECT * FROM contact_submissions';
    if (filter === 'unread') sql += ' WHERE is_read = 0 AND is_archived = 0';
    else if (filter === 'archived') sql += ' WHERE is_archived = 1';
    else sql += ' WHERE is_archived = 0';
    sql += ' ORDER BY submitted_at DESC';
    try { res.json(await query(sql)); } catch { res.status(500).json({ error: 'Failed to fetch submissions' }); }
});

router.get('/contact/unread-count', authMiddleware, async (req, res) => {
    try {
        const r: any = await query('SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = 0 AND is_archived = 0');
        res.json({ count: Array.isArray(r) ? r[0]?.count ?? 0 : r?.count ?? 0 });
    } catch { res.json({ count: 0 }); }
});

router.put('/contact/submissions/:id/read', authMiddleware, async (req, res) => {
    await query('UPDATE contact_submissions SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

router.put('/contact/submissions/:id/archive', authMiddleware, async (req, res) => {
    await query('UPDATE contact_submissions SET is_archived = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

router.delete('/contact/submissions/:id', authMiddleware, async (req, res) => {
    await query('DELETE FROM contact_submissions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

// PAGES
router.get('/pages', async (req, res) => {
    try {
        const pages = await query(`
            SELECT p.*, pc.title_en, pc.title_fr, pc.subtitle_1_en, pc.subtitle_1_fr, pc.subtitle_2_en, pc.subtitle_2_fr, pc.subtitle_3_en, pc.subtitle_3_fr,
                   pc.body_1_en, pc.body_1_fr, pc.body_2_en, pc.body_2_fr, pc.body_3_en, pc.body_3_fr, pc.body_4_en, pc.body_4_fr,
                   pc.image_1_id, pc.image_1_alt_en, pc.image_1_alt_fr, pc.image_1_caption_en, pc.image_1_caption_fr,
                   pc.image_2_id, pc.image_2_alt_en, pc.image_2_alt_fr, pc.image_2_caption_en, pc.image_2_caption_fr,
                   pc.image_3_id, pc.image_3_alt_en, pc.image_3_alt_fr,
                   pc.button_1_label_en, pc.button_1_label_fr, pc.button_1_url, pc.button_1_enabled, 
                   pc.button_2_label_en, pc.button_2_label_fr, pc.button_2_url, pc.button_2_enabled,
                   pc.button_3_label_en, pc.button_3_label_fr, pc.button_3_url, pc.button_3_enabled,
                   pc.faq_label_en, pc.faq_label_fr, pc.faq_title_en, pc.faq_title_fr, pc.faqs,
                   pc.products_title_en, pc.products_title_fr, pc.products,
                   pc.gallery_title_en, pc.gallery_title_fr, pc.gallery,
                   pc.timeline_title_en, pc.timeline_title_fr, pc.timeline,
                   pc.partners_title_en, pc.partners_title_fr, pc.partners,
                   pc.partners_cta1_en, pc.partners_cta1_fr, pc.partners_cta2_en, pc.partners_cta2_fr,
                   m1.url as image_1_id_url, m2.url as image_2_id_url, m3.url as image_3_id_url
            FROM pages p LEFT JOIN page_content pc ON p.id = pc.page_id 
            LEFT JOIN media m1 ON pc.image_1_id = m1.id LEFT JOIN media m2 ON pc.image_2_id = m2.id LEFT JOIN media m3 ON pc.image_3_id = m3.id
            ORDER BY p.order_index ASC
        `);
        const result = pages.map((p: any) => ({
            ...p,
            faqs: p.faqs ? JSON.parse(p.faqs) : [],
            products: p.products ? JSON.parse(p.products) : [],
            gallery: p.gallery ? JSON.parse(p.gallery) : [],
            timeline: p.timeline ? JSON.parse(p.timeline) : [],
            partners: p.partners ? JSON.parse(p.partners) : []
        }));
        res.json(result);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch pages' }); }
});

router.post('/pages', authMiddleware, async (req, res) => {
    const { slug, menu_label_en, menu_label_fr } = req.body;
    if (!slug || !menu_label_en || !menu_label_fr) return res.status(400).json({ error: 'All fields are required' });
    try {
        const result: any = await query('INSERT INTO pages (slug, menu_label_en, menu_label_fr, order_index) VALUES (?, ?, ?, ?)', [slug, menu_label_en, menu_label_fr, 999]);
        await query('INSERT INTO page_content (page_id, title_en, title_fr) VALUES (?, ?, ?)', [result.insertId, menu_label_en, menu_label_fr]);
        res.status(201).json({ id: result.insertId });
    } catch (error) { res.status(500).json({ error: 'Failed to create page' }); }
});

router.put('/pages/:id', authMiddleware, async (req, res) => {
    const { slug, is_visible, menu_label_en, menu_label_fr, title_en, title_fr, subtitle_1_en, subtitle_1_fr, subtitle_2_en, subtitle_2_fr, subtitle_3_en, subtitle_3_fr, body_1_en, body_1_fr, body_2_en, body_2_fr, body_3_en, body_3_fr, body_4_en, body_4_fr, image_1_id, image_1_alt_en, image_1_alt_fr, image_1_caption_en, image_1_caption_fr, image_2_id, image_2_alt_en, image_2_alt_fr, image_2_caption_en, image_2_caption_fr, image_3_id, image_3_alt_en, image_3_alt_fr, button_1_label_en, button_1_label_fr, button_1_url, button_1_enabled, button_2_label_en, button_2_label_fr, button_2_url, button_2_enabled, button_3_label_en, button_3_label_fr, button_3_url, button_3_enabled, faq_label_en, faq_label_fr, faq_title_en, faq_title_fr, faqs, products_title_en, products_title_fr, products, gallery_title_en, gallery_title_fr, gallery, timeline_title_en, timeline_title_fr, timeline, partners_title_en, partners_title_fr, partners, partners_cta1_en, partners_cta1_fr, partners_cta2_en, partners_cta2_fr } = req.body;
    try {
        await query('UPDATE pages SET slug = ?, is_visible = ?, menu_label_en = ?, menu_label_fr = ? WHERE id = ?', [slug, is_visible, menu_label_en, menu_label_fr, req.params.id]);
        const existing: any = await query('SELECT id FROM page_content WHERE page_id = ?', [req.params.id]);
        const vals = [title_en, title_fr, subtitle_1_en, subtitle_1_fr, subtitle_2_en, subtitle_2_fr, subtitle_3_en, subtitle_3_fr, body_1_en, body_1_fr, body_2_en, body_2_fr, body_3_en, body_3_fr, body_4_en, body_4_fr, image_1_id, image_1_alt_en, image_1_alt_fr, image_1_caption_en, image_1_caption_fr, image_2_id, image_2_alt_en, image_2_alt_fr, image_2_caption_en, image_2_caption_fr, image_3_id, image_3_alt_en, image_3_alt_fr, button_1_label_en, button_1_label_fr, button_1_url, button_1_enabled, button_2_label_en, button_2_label_fr, button_2_url, button_2_enabled, button_3_label_en, button_3_label_fr, button_3_url, button_3_enabled, faq_label_en, faq_label_fr, faq_title_en, faq_title_fr, faqs ? JSON.stringify(faqs) : null, products_title_en, products_title_fr, products ? JSON.stringify(products) : null, gallery_title_en, gallery_title_fr, gallery ? JSON.stringify(gallery) : null, timeline_title_en, timeline_title_fr, timeline ? JSON.stringify(timeline) : null, partners_title_en, partners_title_fr, partners ? JSON.stringify(partners) : null, partners_cta1_en, partners_cta1_fr, partners_cta2_en, partners_cta2_fr];
        if ((Array.isArray(existing) ? existing.length : 0) > 0) {
            await query(`UPDATE page_content SET title_en=?,title_fr=?,subtitle_1_en=?,subtitle_1_fr=?,subtitle_2_en=?,subtitle_2_fr=?,subtitle_3_en=?,subtitle_3_fr=?,body_1_en=?,body_1_fr=?,body_2_en=?,body_2_fr=?,body_3_en=?,body_3_fr=?,body_4_en=?,body_4_fr=?,image_1_id=?,image_1_alt_en=?,image_1_alt_fr=?,image_1_caption_en=?,image_1_caption_fr=?,image_2_id=?,image_2_alt_en=?,image_2_alt_fr=?,image_2_caption_en=?,image_2_caption_fr=?,image_3_id=?,image_3_alt_en=?,image_3_alt_fr=?,button_1_label_en=?,button_1_label_fr=?,button_1_url=?,button_1_enabled=?,button_2_label_en=?,button_2_label_fr=?,button_2_url=?,button_2_enabled=?,button_3_label_en=?,button_3_label_fr=?,button_3_url=?,button_3_enabled=?,faq_label_en=?,faq_label_fr=?,faq_title_en=?,faq_title_fr=?,faqs=?,products_title_en=?,products_title_fr=?,products=?,gallery_title_en=?,gallery_title_fr=?,gallery=?,timeline_title_en=?,timeline_title_fr=?,timeline=?,partners_title_en=?,partners_title_fr=?,partners=?,partners_cta1_en=?,partners_cta1_fr=?,partners_cta2_en=?,partners_cta2_fr=? WHERE page_id=?`, [...vals, req.params.id]);
        } else {
            await query(`INSERT INTO page_content (page_id,title_en,title_fr,subtitle_1_en,subtitle_1_fr,subtitle_2_en,subtitle_2_fr,subtitle_3_en,subtitle_3_fr,body_1_en,body_1_fr,body_2_en,body_2_fr,body_3_en,body_3_fr,body_4_en,body_4_fr,image_1_id,image_1_alt_en,image_1_alt_fr,image_1_caption_en,image_1_caption_fr,image_2_id,image_2_alt_en,image_2_alt_fr,image_2_caption_en,image_2_caption_fr,image_3_id,image_3_alt_en,image_3_alt_fr,button_1_label_en,button_1_label_fr,button_1_url,button_1_enabled,button_2_label_en,button_2_label_fr,button_2_url,button_2_enabled,button_3_label_en,button_3_label_fr,button_3_url,button_3_enabled,faq_label_en,faq_label_fr,faq_title_en,faq_title_fr,faqs,products_title_en,products_title_fr,products,gallery_title_en,gallery_title_fr,gallery,timeline_title_en,timeline_title_fr,timeline,partners_title_en,partners_title_fr,partners,partners_cta1_en,partners_cta1_fr,partners_cta2_en,partners_cta2_fr) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [req.params.id, ...vals]);
        }
        res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: 'Failed to update page: ' + error.message }); }
});

router.delete('/pages/:id', authMiddleware, async (req, res) => {
    try {
        await query('DELETE FROM page_content WHERE page_id = ?', [req.params.id]);
        await query('DELETE FROM pages WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: 'Failed to delete page: ' + error.message }); }
});

router.get('/pages/:slug', async (req, res) => {
    try {
        const pages: any = await query(`SELECT p.*, pc.*, m1.url as image_1_id_url, m2.url as image_2_id_url, m3.url as image_3_id_url FROM pages p LEFT JOIN page_content pc ON p.id = pc.page_id LEFT JOIN media m1 ON pc.image_1_id = m1.id LEFT JOIN media m2 ON pc.image_2_id = m2.id LEFT JOIN media m3 ON pc.image_3_id = m3.id WHERE p.slug = ?`, [req.params.slug]);
        const page = Array.isArray(pages) ? pages[0] : pages;
        if (!page) return res.status(404).json({ error: 'Page not found' });
        // Parse JSON fields
        ['faqs', 'products', 'gallery', 'timeline', 'partners'].forEach(field => {
            if (page[field]) {
                try {
                    page[field] = JSON.parse(page[field]);
                } catch (e) {
                    page[field] = [];
                }
            }
        });
        // Resolve image IDs to URLs for products, gallery, timeline, and partners
        const mediaIds: number[] = [];
        const imageFields: Array<{array: any[], idField: string, urlField: string}> = [];
        // Collect all image IDs from arrays
        if (Array.isArray(page.products)) {
            imageFields.push({ array: page.products, idField: 'image_id', urlField: 'image_url' });
        }
        if (Array.isArray(page.gallery)) {
            imageFields.push({ array: page.gallery, idField: 'image_id', urlField: 'image_url' });
        }
        if (Array.isArray(page.timeline)) {
            imageFields.push({ array: page.timeline, idField: 'image_id', urlField: 'image_url' });
        }
        if (Array.isArray(page.partners)) {
            imageFields.push({ array: page.partners, idField: 'image_id', urlField: 'image_url' });
        }
        // Collect unique IDs
        imageFields.forEach(({ array, idField }) => {
            array.forEach((item: any) => {
                if (item[idField]) mediaIds.push(item[idField]);
            });
        });
        // Fetch media URLs if there are any IDs
        if (mediaIds.length > 0) {
            const placeholders = mediaIds.map(() => '?').join(',');
            const media: any = await query(`SELECT id, url FROM media WHERE id IN (${placeholders})`, mediaIds);
            const mediaMap = new Map((Array.isArray(media) ? media : []).map((m: any) => [m.id, m.url]));
            // Assign URLs to items
            imageFields.forEach(({ array, idField, urlField }) => {
                array.forEach((item: any) => {
                    if (item[idField]) {
                        item[urlField] = mediaMap.get(item[idField]) || null;
                    }
                });
            });
        }
        res.json(page);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch page' }); }
})

// BLOG
router.get('/blog', async (req, res) => {
    try { res.json(await query('SELECT b.*, m.url as cover_url FROM blog_posts b LEFT JOIN media m ON b.cover_image_id = m.id WHERE b.is_published = 1 ORDER BY b.published_at DESC')); }
    catch { res.status(500).json({ error: 'Failed to fetch posts' }); }
});

router.get('/blog/:slug', async (req, res) => {
    try {
        const posts: any = await query('SELECT b.*, m.url as cover_url FROM blog_posts b LEFT JOIN media m ON b.cover_image_id = m.id WHERE b.slug = ? AND b.is_published = 1', [req.params.slug]);
        const post = Array.isArray(posts) ? posts[0] : posts;
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch { res.status(500).json({ error: 'Failed to fetch post' }); }
});

router.get('/admin/blog', authMiddleware, async (req, res) => {
    try { res.json(await query('SELECT b.*, m.url as cover_url FROM blog_posts b LEFT JOIN media m ON b.cover_image_id = m.id ORDER BY b.created_at DESC')); }
    catch { res.status(500).json({ error: 'Failed to fetch posts' }); }
});

router.post('/blog', authMiddleware, async (req, res) => {
    const { slug, title_en, title_fr, body_en, body_fr, author, is_published, cover_image_id, published_at, meta_title_en, meta_title_fr, meta_desc_en, meta_desc_fr } = req.body;
    try {
        const toDate = (v: any) => v ? String(v).split('T')[0] : null;
        const result: any = await query(`INSERT INTO blog_posts (slug,title_en,title_fr,body_en,body_fr,author,is_published,published_at,cover_image_id,meta_title_en,meta_title_fr,meta_desc_en,meta_desc_fr) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [slug, title_en, title_fr, body_en, body_fr, author, is_published, toDate(published_at) || (is_published ? new Date().toISOString().split('T')[0] : null), cover_image_id || null, meta_title_en || null, meta_title_fr || null, meta_desc_en || null, meta_desc_fr || null]);
        res.status(201).json({ id: result.insertId });
    } catch (error: any) { res.status(500).json({ error: 'Failed to create post: ' + error.message }); }
});

router.put('/blog/:id', authMiddleware, async (req, res) => {
    const { slug, title_en, title_fr, body_en, body_fr, author, is_published, cover_image_id, published_at, meta_title_en, meta_title_fr, meta_desc_en, meta_desc_fr } = req.body;
    try {
        const toDate2 = (v: any) => v ? String(v).split('T')[0] : null;
        await query(`UPDATE blog_posts SET slug=?,title_en=?,title_fr=?,body_en=?,body_fr=?,author=?,is_published=?,published_at=?,cover_image_id=?,meta_title_en=?,meta_title_fr=?,meta_desc_en=?,meta_desc_fr=? WHERE id=?`,
            [slug, title_en, title_fr, body_en, body_fr, author, is_published, toDate2(published_at), cover_image_id || null, meta_title_en || null, meta_title_fr || null, meta_desc_en || null, meta_desc_fr || null, req.params.id]);
        res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: 'Failed to update post: ' + error.message }); }
});

router.delete('/blog/:id', authMiddleware, async (req, res) => {
    try { await query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch { res.status(500).json({ error: 'Failed to delete post' }); }
});

// MEDIA
router.get('/media/public', async (req, res) => {
    try {
        const { type, gallery } = req.query;
        let sql = 'SELECT * FROM media';
        const conditions: string[] = [];
        if (type === 'image') conditions.push("mime_type LIKE 'image/%'");
        else if (type === 'document') conditions.push("mime_type NOT LIKE 'image/%'");
        if (gallery === 'true') conditions.push('show_in_gallery = 1');
        if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' ORDER BY uploaded_at DESC';
        res.json(await query(sql));
    } catch {
        res.status(500).json({ error: 'Failed to fetch media' });
    }
});

router.get('/media', authMiddleware, async (req, res) => {
    try {
        const { type } = req.query;
        let sql = 'SELECT * FROM media';
        if (type === 'image') sql += " WHERE mime_type LIKE 'image/%'";
        else if (type === 'document') sql += " WHERE mime_type NOT LIKE 'image/%'";
        sql += ' ORDER BY uploaded_at DESC';
        res.json(await query(sql));
    } catch { res.status(500).json({ error: 'Failed to fetch media' }); }
});

router.post('/media/upload', authMiddleware, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
        const fileUrl = `/uploads/${req.file.filename}`;
        const result: any = await query('INSERT INTO media (filename, original_name, mime_type, size, url) VALUES (?, ?, ?, ?, ?)',
            [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, fileUrl]);
        res.status(201).json({ id: result.insertId, url: fileUrl, filename: req.file.filename, original_name: req.file.originalname, mime_type: req.file.mimetype, size: req.file.size });
    } catch (error: any) { res.status(500).json({ error: 'Failed to save media: ' + error.message }); }
});

router.put('/media/:id', authMiddleware, async (req, res) => {
    const { alt_text_en, alt_text_fr, category, show_in_gallery } = req.body;
    try {
        await query('UPDATE media SET alt_text_en = ?, alt_text_fr = ?, category = ?, show_in_gallery = ? WHERE id = ?', [alt_text_en, alt_text_fr, category, show_in_gallery ? 1 : 0, req.params.id]);
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Failed to update media' }); }
});

router.delete('/media/:id', authMiddleware, async (req, res) => {
    try {
        const files: any = await query('SELECT * FROM media WHERE id = ?', [req.params.id]);
        const file = Array.isArray(files) ? files[0] : files;
        if (file) {
            const filePath = path.join(process.cwd(), 'uploads', file.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            await query('DELETE FROM media WHERE id = ?', [req.params.id]);
        }
        res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: 'Failed to delete media: ' + error.message }); }
});

// EVENTS
router.get('/events', async (req, res) => {
    try { res.json(await query('SELECT e.*, m.url as cover_url FROM events e LEFT JOIN media m ON e.cover_image_id = m.id WHERE e.is_published = 1 ORDER BY e.start_date ASC')); }
    catch { res.status(500).json({ error: 'Failed to fetch events' }); }
});

router.get('/admin/events', authMiddleware, async (req, res) => {
    try { res.json(await query('SELECT e.*, m.url as cover_url FROM events e LEFT JOIN media m ON e.cover_image_id = m.id ORDER BY e.start_date DESC')); }
    catch { res.status(500).json({ error: 'Failed to fetch events' }); }
});

router.post('/events', authMiddleware, async (req, res) => {
    const { title_en, title_fr, description_en, description_fr, location, start_date, end_date, cover_image_id, is_published } = req.body;
    if (!title_en || !title_fr) return res.status(400).json({ error: 'Titles (EN & FR) are required' });
    try {
        const result: any = await query('INSERT INTO events (title_en,title_fr,description_en,description_fr,location,start_date,end_date,cover_image_id,is_published) VALUES (?,?,?,?,?,?,?,?,?)',
            [title_en, title_fr, description_en, description_fr, location, start_date, end_date, cover_image_id, is_published || 0]);
        res.status(201).json({ id: result.insertId });
    } catch (error: any) { res.status(500).json({ error: 'Failed to create event: ' + error.message }); }
});

router.put('/events/:id', authMiddleware, async (req, res) => {
    const { title_en, title_fr, description_en, description_fr, location, start_date, end_date, cover_image_id, is_published } = req.body;
    try {
        await query('UPDATE events SET title_en=?,title_fr=?,description_en=?,description_fr=?,location=?,start_date=?,end_date=?,cover_image_id=?,is_published=? WHERE id=?',
            [title_en, title_fr, description_en, description_fr, location, start_date, end_date, cover_image_id, is_published, req.params.id]);
        res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: 'Failed to update event: ' + error.message }); }
});

router.delete('/events/:id', authMiddleware, async (req, res) => {
    try { await query('DELETE FROM events WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch { res.status(500).json({ error: 'Failed to delete event' }); }
});

// MENU
router.get('/menu', async (req, res) => {
    try { res.json(await query('SELECT * FROM menu_items WHERE is_visible = 1 ORDER BY order_index ASC')); }
    catch { res.status(500).json({ error: 'Failed to fetch menu' }); }
});


// ─── PRODUCTS ────────────────────────────────────────────────────────────────
router.get('/products', async (req, res) => {
    try { res.json(await query('SELECT p.*, m.url as cover_url FROM products p LEFT JOIN media m ON p.cover_image_id = m.id WHERE p.is_published = 1 ORDER BY p.order_index ASC, p.id ASC')); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.get('/admin/products', authMiddleware, async (req, res) => {
    try { res.json(await query('SELECT p.*, m.url as cover_url FROM products p LEFT JOIN media m ON p.cover_image_id = m.id ORDER BY p.order_index ASC, p.id ASC')); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post('/products', authMiddleware, async (req, res) => {
    const { slug, name_en, name_fr, description_en, description_fr, long_description_en, long_description_fr, badge, cover_image_id, order_index, is_published } = req.body;
    try {
        const result: any = await query(
            'INSERT INTO products (slug,name_en,name_fr,description_en,description_fr,long_description_en,long_description_fr,badge,cover_image_id,order_index,is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [slug, name_en, name_fr, description_en, description_fr, long_description_en, long_description_fr, badge || null, cover_image_id || null, order_index || 0, is_published ? 1 : 0]
        );
        res.json({ id: result.insertId });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.put('/products/:id', authMiddleware, async (req, res) => {
    const { slug, name_en, name_fr, description_en, description_fr, long_description_en, long_description_fr, badge, cover_image_id, order_index, is_published } = req.body;
    try {
        await query(
            'UPDATE products SET slug=?,name_en=?,name_fr=?,description_en=?,description_fr=?,long_description_en=?,long_description_fr=?,badge=?,cover_image_id=?,order_index=?,is_published=? WHERE id=?',
            [slug, name_en, name_fr, description_en, description_fr, long_description_en, long_description_fr, badge || null, cover_image_id || null, order_index || 0, is_published ? 1 : 0, req.params.id]
        );
        res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.delete('/products/:id', authMiddleware, async (req, res) => {
    try { await query('DELETE FROM products WHERE id=?', [req.params.id]); res.json({ success: true }); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
