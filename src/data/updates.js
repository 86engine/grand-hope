// src/data/updates.js
import wpData from './wp-data.json' with { type: 'json' };
import { localizeURL } from './site.js';

export async function getUpdates(lang = 'en', page = 1, perPage = 10) {
  const items = wpData.posts.filter(p => p.lang === lang);
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginatedItems = items.slice(start, start + perPage);

  const posts = paginatedItems.map(update => {
    const translations = {};
    if (update.translations) {
      for (const [l, t] of Object.entries(update.translations)) {
        if (t.link) {
          translations[l] = { link: localizeURL(t.link) };
        }
      }
    }
    if (update.link) {
      translations[lang] = { link: localizeURL(update.link) };
    }

    return {
      content_id: update.acf?.content_id,
      id: update.slug,
      category: update.category_list?.[0]?.name || '',
      author: update._embedded?.author?.[0]?.name || 'Grand-Hope',
      title: update.title?.rendered || '',
      content: update.content?.rendered || '',
      summary: update.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      image: update.featured_image?.url || '',
      date: update.modified,
      pageTitle: update.acf?.news_page_title || '',
      pageKeywords: update.acf?.news_page_keywords || '',
      pageDescription: update.acf?.news_page_des || '',
      pageH1: update.acf?.news_page_h1 || '',
      link: update.link,
      acf: update.acf,
      translations,
    };
  });

  return { posts, total, totalPages, currentPage: page };
}