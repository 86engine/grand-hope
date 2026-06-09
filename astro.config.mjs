import { defineConfig } from 'astro/config';
import purgecss from 'astro-purgecss';

export default defineConfig({
  site: 'https://grand-hope.com.cn',
  integrations: [
    purgecss({
      safelist: {
        standard: [
          /^mfp-/,
          /^swiper/,
          /^rs-pagination/,
          /^rs-swiper/,
          /^popup/,
          /^modal/,
        ],
      },
    }),
  ],
});