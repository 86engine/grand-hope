// src/data/applicationCategories.js
import wpData from './wp-data.json' with { type: 'json' };

export async function getApplicationCategories(lang = 'en') {
  const page = wpData.applicationCategories[lang];
  if (!page) return {};

  const blocks = [];
  const suffixes = ['three', 'four', 'five', 'six'];

  for (const suffix of suffixes) {
    const titleKey = `application_category_${suffix}_title`;
    const desKey = `application_category_${suffix}_des`;
    const imgKey = `application_category_${suffix}_img`;
    const bottomKey = `application_category_${suffix}_des_bottom`;

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
    pageTitle: page.acf?.application_category_title,
    pageDescription: page.acf?.application_category_des,
    pageKeywords: page.acf?.application_category_keywords,
    pageH1: page.acf?.application_category_title_h1,
    pageBackground: page.acf?.application_category_bg_img,
    pageModuleOneTitle: page.acf?.application_category_one_title,
    pageModuleOneDescription: page.acf?.application_category_one_des,
    pageModuleTwoTitle: page.acf?.application_category_two_title,
    pageModuleTwoDescription: page.acf?.application_category_two_des,
    blocks,
    slug: page.slug,
    translations: page.translations,
  };
}