// src/data/productCategories.js
import wpData from './wp-data.json' with { type: 'json' };

export async function getProductCategories(lang = 'en') {
  const page = wpData.productCategories[lang];
  if (!page) return {};

  const blocks = [];
  const suffixes = ['three', 'four', 'five', 'six'];

  for (const suffix of suffixes) {
    const titleKey = `product_category_${suffix}_title`;
    const desKey = `product_category_${suffix}_des`;
    const imgKey = `product_category_${suffix}_img`;
    const bottomKey = `product_category_${suffix}_des_bottom`;

    if (page.acf?.[titleKey] || page.acf?.[desKey] || page.acf?.[imgKey] || page.acf?.[bottomKey]) {
      blocks.push({
        title: page.acf[titleKey] || '',
        description: page.acf[desKey] || '',
        image: page.acf[imgKey] || '',
        bottomText: page.acf[bottomKey] || '',
      });
    }
  }

  return {
    pageTitle: page.acf?.product_category_title,
    pageDescription: page.acf?.product_category_des,
    pageKeywords: page.acf?.product_category_keywords,
    pageH1: page.acf?.product_category_title_h1,
    pageModuleOneTitle: page.acf?.product_category_one_title,
    pageModuleOneDescription: page.acf?.product_category_one_des,
    pageModuleTwoTitle: page.acf?.product_category_two_title,
    pageModuleTwoDescription: page.acf?.product_category_two_des,
    blocks,
    slug: page.slug,
    translations: page.translations,
  };
}