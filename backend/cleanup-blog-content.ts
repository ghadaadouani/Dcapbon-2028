import { query } from './src/db';

async function cleanupBlogContent() {
    try {
        // Get all blog posts
        const posts: any = await query('SELECT id, body_en, body_fr FROM blog_posts');
        
        for (const post of posts) {
            let body_en = post.body_en || '';
            let body_fr = post.body_fr || '';
            
            // Remove inline image section (the div with aspect-video and caption)
            body_en = body_en.replace(/<div class="my-16 flex flex-col gap-4">[\s\S]*?<\/div>\s*<p class="text-\[10px\] text-center[^>]*>[^<]*<\/p>/gi, '');
            body_fr = body_fr.replace(/<div class="my-16 flex flex-col gap-4">[\s\S]*?<\/div>\s*<p class="text-\[10px\] text-center[^>]*>[^<]*<\/p>/gi, '');
            
            // Remove quote section (the p with font-serif italic and border-l-4)
            body_en = body_en.replace(/<p class="font-serif italic text-2xl[^>]*>[\s\S]*?<\/p>/gi, '');
            body_fr = body_fr.replace(/<p class="font-serif italic text-2xl[^>]*>[\s\S]*?<\/p>/gi, '');
            
            // Update the post if content changed
            if (body_en !== post.body_en || body_fr !== post.body_fr) {
                await query('UPDATE blog_posts SET body_en = ?, body_fr = ? WHERE id = ?', [body_en, body_fr, post.id]);
                console.log(`✅ Cleaned up post ${post.id}`);
            }
        }
        
        console.log('✅ Blog content cleanup completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning up blog content:', error);
        process.exit(1);
    }
}

cleanupBlogContent();
