// src/data/products.js
import { localizeURL } from './site.js';
import wpData from './wp-data.json' with { type: 'json' };

const PRODUCTS_BY_CONTENT_ID = new Map();
for (const product of wpData.products) {
  const contentId = product.acf?.content_id;
  if (!contentId) continue;
  const group = PRODUCTS_BY_CONTENT_ID.get(contentId) || {};
  group[product.lang] = product;
  PRODUCTS_BY_CONTENT_ID.set(contentId, group);
}

function buildBlocks(acf) {
  if (!acf) return [];
  const blocks = [];
  const suffixes = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  for (const suffix of suffixes) {
    const titleKey = `product_${suffix}_title`;
    if (!acf[titleKey]) continue;
    const block = { title: acf[titleKey] };
    switch (suffix) {
      case 'one': case 'two': case 'three': case 'four': case 'five':
        block.type = 'standard';
        block.topText = acf[`product_${suffix}_des_top`] || '';
        block.middleText = acf[`product_${suffix}_des_middle`] || '';
        block.image = acf[`product_${suffix}_img`] || '';
        block.bottomText = acf[`product_${suffix}_des_bottom`] || '';
        break;
      case 'six':
        block.type = 'video';
        block.topText = acf[`product_${suffix}_des_top`] || '';
        block.videoImg = acf['video_img'] || '';
        block.video = acf[`product_${suffix}_video`] || '';
        block.bottomText = acf[`product_${suffix}_des_bottom`] || '';
        break;
      case 'seven':
        block.type = 'carousel';
        block.topText = acf[`product_${suffix}_des_top`] || '';
        block.images = acf[`product_${suffix}_img`] || [];
        block.bottomText = acf[`product_${suffix}_des_bottom`] || '';
        break;
      case 'eight':
        block.type = 'faq';
        block.faqs = acf['product_eight_faq'] || [];
        break;
    }
    blocks.push(block);
  }
  return blocks;
}

export async function getProducts(lang = 'en') {
  const items = wpData.products.filter(p => p.lang === lang);
  return items.map(product => {
    const translations = {};
    if (product.translations) {
      for (const [l, t] of Object.entries(product.translations)) {
        if (t.link) {
          translations[l] = { link: localizeURL(t.link) };
        }
      }
    }
     if (product.link) {
      translations[lang] = { link: localizeURL(product.link) };
    }
    return {
      content_id: product.acf?.content_id,
      id: product.slug,
      pageTitle: product.acf?.product_page_title,
      pageKeywords: product.acf?.product_page_keywords,
      pageDescription: product.acf?.product_page_des,
      pageBackground: product.acf?.product_bg_img?.url || product.acf?.product_bg_img,
      pageH1: product.acf?.product_h1,
      productName: product.acf?.product_name,
      productListDescription: product.acf?.product_category_overview,
      productOverview: product.acf?.product_overview,
      productListImage: product.acf?.product_category_img?.url || product.acf?.product_category_img,
      productImage: product.acf?.product_img?.url || product.acf?.product_img,
      productManual: product.acf?.product_manual,
      link: product.link,
      acf: product.acf,
      translations,
      blocks: buildBlocks(product.acf)
    };
  });
}