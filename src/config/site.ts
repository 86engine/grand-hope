export const LANGS = ['en', 'zh', 'ja'] as const;
export type Lang = (typeof LANGS)[number];

// 四个纯静态页面：不做任何 WP 查询
export const STATIC_PAGES: Record<string, Record<Lang, string>> = {
  home: { en: '/', zh: '/zh/', ja: '/ja/' },
  contact: { en: '/contact', zh: '/zh/contact', ja: '/ja/contact' },
  downloads: { en: '/downloads', zh: '/zh/downloads', ja: '/ja/downloads' },
  'privacy-policy': { en: '/privacy-policy', zh: '/zh/privacy-policy', ja: '/ja/privacy-policy' },
};

// 判断一个 content_id 是否为静态页面
export function isStaticPage(contentId: string): boolean {
  return contentId in STATIC_PAGES;
}

