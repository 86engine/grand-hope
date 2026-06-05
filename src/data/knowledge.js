// src/data/knowledge.js
import { localizeURL } from './site.js';
import wpData from './wp-data.json' with { type: 'json' };

function buildBlocks(acf) {
  if (!acf) return [];
  const blocks = [];
  const suffixes = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
  for (const suffix of suffixes) {
    const titleKey = `knowledge_${suffix}_title`;
    if (!acf[titleKey]) continue;
    const block = { title: acf[titleKey] };
    switch (suffix) {
      case 'one': case 'two': case 'three': case 'four': case 'five': case 'six': case 'seven': case 'eleven':
        block.type = 'standard';
        block.topText = acf[`knowledge_${suffix}_des_top`] || '';
        block.middleText = acf[`knowledge_${suffix}_des_middle`] || '';
        block.image = acf[`knowledge_${suffix}_img`] || '';
        block.bottomText = acf[`knowledge_${suffix}_des_bottom`] || '';
        break;
      case 'eight':
        block.type = 'video';
        block.topText = acf[`knowledge_${suffix}_des_top`] || '';
        block.videoImg = acf['knowledge_video_img'] || '';
        block.video = acf[`knowledge_${suffix}_video`] || '';
        block.middleText = acf[`knowledge_${suffix}_des_middle`] || '';
        block.bottomText = acf[`knowledge_${suffix}_des_bottom`] || '';
        break;
      case 'nine':
        block.type = 'carousel';
        block.topText = acf[`knowledge_${suffix}_des_top`] || '';
        block.images = acf[`knowledge_${suffix}_img`] || [];
        block.bottomText = acf[`knowledge_${suffix}_des_bottom`] || '';
        break;
      case 'ten':
        block.type = 'faq';
        block.faqs = acf[`knowledge_${suffix}_faq`] || [];
        break;
    }
    blocks.push(block);
  }
  return blocks;
}

export async function getKnowledge(lang = 'en') {
  const items = wpData.knowledge.filter(k => k.lang === lang);
  return items.map(knowledge => {
    const translations = {};
    if (knowledge.translations) {
      for (const [l, t] of Object.entries(knowledge.translations)) {
        if (t.link) {
          translations[l] = { link: localizeURL(t.link) };
        }
      }
    }
    if (knowledge.link) {
  translations[lang] = { link: localizeURL(knowledge.link) };
      }
    return {
      content_id: knowledge.acf?.content_id,
      id: knowledge.slug,
      acf: knowledge.acf,
      translations,
      blocks: buildBlocks(knowledge.acf)
    };
  });
}