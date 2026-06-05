// scripts/sync-wp.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://wp.grand-hope.com.cn/wp-json/wp/v2';
const LANGS = ['en', 'ja', 'zh'];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url} (${res.status})`);
  const data = await res.json();
  return data.list || data;
}

async function fetchPage(id, lang) {
  const url = `${BASE}/pages/${id}?lang=${lang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url} (${res.status})`);
  return res.json();
}

async function main() {
  console.log('🔄 开始同步 WordPress 数据...');
  const wpData = {
    products: [],
    applications: [],
    knowledge: [],
    posts: [],
    productCategories: {},
    applicationCategories: {},
    knowledgeParentCategory: {},
    updatesCategory: {},
    aboutPages: {},
  };

  // WP 自定义 post type 路由名映射
  const typeMap = {
    products: 'carbon-felt',
    applications: 'carbon-felt-uses',
    knowledge: 'knowledge',
    posts: 'posts',
  };

  // 1. 产品/应用/知识/新闻详情
  for (const lang of LANGS) {
    console.log(`  获取 ${lang} 数据...`);
    for (const [key, wpType] of Object.entries(typeMap)) {
      try {
        const items = await fetchJSON(`${BASE}/${wpType}?lang=${lang}&per_page=100`);
        wpData[key].push(...items);
        console.log(`    ${wpType}: ${items.length} 条`);
      } catch (err) {
        console.warn(`    ⚠️ 跳过 ${wpType}: ${err.message}`);
      }
    }
  }

  // 2. 产品分类页（carbon-felt 列表）
  const productCatIds = { en: 1230, ja: 3197, zh: 1883 };
  for (const [lang, id] of Object.entries(productCatIds)) {
    console.log(`  获取产品分类页 ${lang}...`);
    wpData.productCategories[lang] = await fetchPage(id, lang);
  }

  // 3. 应用分类页（carbon-felt-uses 列表）
  const appCatIds = { en: 1247, ja: 3205, zh: 2008 };
  for (const [lang, id] of Object.entries(appCatIds)) {
    console.log(`  获取应用分类页 ${lang}...`);
    wpData.applicationCategories[lang] = await fetchPage(id, lang);
  }

  // 4. 知识列表页
  const knowledgeParentIds = { en: 3003, ja: 3203, zh: 3009 };
  for (const [lang, id] of Object.entries(knowledgeParentIds)) {
    console.log(`  获取知识列表页 ${lang}...`);
    wpData.knowledgeParentCategory[lang] = await fetchPage(id, lang);
  }

  // 5. 新闻列表页（updates）
  const updatesIds = { en: 3141, ja: 3201, zh: 3147 };
  for (const [lang, id] of Object.entries(updatesIds)) {
    console.log(`  获取新闻列表页 ${lang}...`);
    wpData.updatesCategory[lang] = await fetchPage(id, lang);
  }

  // 6. 关于页
  const aboutIds = { en: 1787, ja: 3199, zh: 1845 };
  for (const [lang, id] of Object.entries(aboutIds)) {
    console.log(`  获取关于页 ${lang}...`);
    wpData.aboutPages[lang] = await fetchPage(id, lang);
  }

  // 写入文件
  const outPath = path.join(__dirname, '..', 'src', 'data', 'wp-data.json');
  fs.writeFileSync(outPath, JSON.stringify(wpData, null, 2));
  console.log(`✅ 同步完成 → src/data/wp-data.json`);
}

main().catch(err => {
  console.error('❌ 同步失败:', err);
  process.exit(1);
});