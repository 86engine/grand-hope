// src/data/parentKnowledge.js
import wpData from './wp-data.json' with { type: 'json' };

export async function getKnowledgeCategory(lang = 'en') {
  const page = wpData.knowledgeParentCategory[lang];
  if (!page) return {};

  const blocks = [];
  const suffixes = ['three', 'four', 'five', 'six'];

  for (const suffix of suffixes) {
    const titleKey = `parent_knowledge_cat_${suffix}_title`;
    const desKey = `parent_knowledge_cat_${suffix}_des`;
    const imgKey = `parent_knowledge_cat_${suffix}_img`;
    const bottomKey = `parent_knowledge_cat_${suffix}_des_bottom`;

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
    pageTitle: page.acf?.parent_knowledge_cat_title,
    pageDescription: page.acf?.parent_knowledge_cat_des,
    pageKeywords: page.acf?.parent_knowledge_cat_keywords,
    pageH1: page.acf?.parent_knowledge_cat_title_h1,
    pageModuleOneTitle: page.acf?.parent_knowledge_cat_one_title,
    pageModuleOneDescription: page.acf?.parent_knowledge_cat_one_des,
    pageModuleTwoTitle: page.acf?.parent_knowledge_cat_two_title,
    pageModuleTwoDescription: page.acf?.parent_knowledge_cat_two_des,
    blocks,
    slug: page.slug,
    translations: page.translations,
  };
}