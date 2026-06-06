// src/data/site.js
// 统一数据层：读取 wp-data.json 并构建 content_id → translations 索引
import wpData from './wp-data.json' with { type: 'json' };
import { LANGS, STATIC_PAGES, isStaticPage } from '../config/site';

const isDev = import.meta.env.DEV;
const WP_DOMAIN = 'https://wp.grand-hope.com.cn';
const LOCAL_DOMAIN = 'http://localhost:4321';

/**
 * 开发环境下将 WP 线上域名替换为本地地址
 */
export function localizeURL(url) {
  if (!url) return url;
  if (url.startsWith(WP_DOMAIN)) {
    if (isDev) {
      return url.replace(WP_DOMAIN, LOCAL_DOMAIN);
    }
    // 生产环境：替换为实际域名
    return url.replace(WP_DOMAIN, 'https://grand-hope.com.cn');
  }
  return url;
}

/**
 * 构建全局翻译索引
 * Map<content_id, { en: { link }, zh: { link }, ja: { link } }>
 */
const translationIndex = new Map();

// 通用：从 translations 对象中提取 link
function extractLink(translationsObj, lang) {
  const t = translationsObj?.[lang];
  if (!t) return null;
  return t.link || null;
}

// 通用：将某个数据项加入索引
function addToIndex(item) {
  const contentId = item.acf?.content_id;
  if (!contentId || !item.translations) return;

  if (!translationIndex.has(contentId)) {
    translationIndex.set(contentId, {});
  }
  const indexEntry = translationIndex.get(contentId);
  for (const lang of LANGS) {
    const link = extractLink(item.translations, lang);
    if (link) {
      indexEntry[lang] = { link: localizeURL(link) };
    }
  }
}

// 1. 处理 products（数组）
if (wpData.products) {
  for (const product of wpData.products) {
    addToIndex(product);
  }
}

// 2. 处理 applications（数组）
if (wpData.applications) {
  for (const app of wpData.applications) {
    addToIndex(app);
  }
}

// 3. 处理 knowledge（数组）
if (wpData.knowledge) {
  for (const item of wpData.knowledge) {
    addToIndex(item);
  }
}

// 4. 处理 posts（数组）
if (wpData.posts) {
  for (const post of wpData.posts) {
    addToIndex(post);
  }
}

// 5. 处理 productCategories（对象：{ en, zh, ja }）
if (wpData.productCategories) {
  for (const page of Object.values(wpData.productCategories)) {
    addToIndex(page);
  }
}

// 6. 处理 applicationCategories
if (wpData.applicationCategories) {
  for (const page of Object.values(wpData.applicationCategories)) {
    addToIndex(page);
  }
}

// 7. 处理 knowledgeParentCategory
if (wpData.knowledgeParentCategory) {
  for (const page of Object.values(wpData.knowledgeParentCategory)) {
    addToIndex(page);
  }
}

// 8. 处理 updatesCategory
if (wpData.updatesCategory) {
  for (const page of Object.values(wpData.updatesCategory)) {
    addToIndex(page);
  }
}

// 9. 处理 aboutPages
if (wpData.aboutPages) {
  for (const page of Object.values(wpData.aboutPages)) {
    addToIndex(page);
  }
}

/**
 * 根据 content_id 获取所有语言的翻译 URL
 */
export function getTranslationsByContentId(contentId) {
  return translationIndex.get(contentId) || null;
}

/**
 * 根据 content_id 和语言获取页面 URL（统一的 URL 获取入口）
 */
export function getPageURL(contentId, lang) {
  if (isStaticPage(contentId)) {
    return STATIC_PAGES[contentId][lang] || '/';
  }

  const translations = getTranslationsByContentId(contentId);
  if (translations?.[lang]?.link) {
    const localizedLink = translations[lang].link;
    // Updates 列表首页实际承载在 /page/1，避免静态站点展示中转重定向页。
    if (contentId === 'newsList') {
      return localizedLink.replace(/\/?$/, '/page/1');
    }
    return localizedLink;
  }

  console.error(`❌ getPageURL: 翻译索引中未找到 content_id="${contentId}"`);
  return STATIC_PAGES.home[lang] || '/';
}

/**
 * 构建面包屑数据
 */
export function buildBreadcrumb(lang, items) {
  const homeLabel = { en: 'Home', zh: '首页', ja: 'ホーム' };
  const homeUrl = STATIC_PAGES.home[lang];

  return [
    { label: homeLabel[lang] || 'Home', href: homeUrl },
    ...items,
  ];
}
