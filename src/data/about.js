// src/data/about.js
import wpData from './wp-data.json' with { type: 'json' };

function buildBlocks(acf) {
  if (!acf) return [];
  const blocks = [];
  const suffixes = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
  for (const suffix of suffixes) {
    const titleKey = `about_${suffix}_title`;
    if (!acf[titleKey]) continue;
    const block = { title: acf[titleKey] };
    switch (suffix) {
      case 'one': case 'two': case 'three': case 'four': case 'five':
        block.type = 'standard';
        block.topText = acf[`about_${suffix}_des_top`] || '';
        block.middleText = acf[`about_${suffix}_des_middle`] || '';
        block.image = acf[`about_${suffix}_img`] || '';
        block.bottomText = acf[`about_${suffix}_des_bottom`] || '';
        break;
      case 'six':
        block.type = 'video';
        block.topText = acf[`about_${suffix}_des_top`] || '';
        block.videoImg = acf['about_video_img'] || '';
        block.video = acf[`about_${suffix}_video`] || '';
        block.middleText = acf[`about_${suffix}_des_middle`] || '';
        block.bottomText = acf[`about_${suffix}_des_bottom`] || '';
        break;
      case 'seven':
        block.type = 'carousel';
        block.topText = acf[`about_${suffix}_des_top`] || '';
        block.images = acf[`about_${suffix}_img`] || [];
        block.bottomText = acf[`about_${suffix}_des_bottom`] || '';
        break;
    }
    blocks.push(block);
  }
  return blocks;
}

export async function getAbout(lang = 'en') {
  const page = wpData.aboutPages[lang];
  if (!page) return {};

  return {
    pageTitle: page.acf?.about_title,
    pageKeywords: page.acf?.about_keywords,
    pageDescription: page.acf?.about_des,
    pageBackground: page.acf?.about_img,
    pageH1: page.acf?.about_h1,
    blocks: buildBlocks(page.acf),
    translations: page.translations,
  };
}