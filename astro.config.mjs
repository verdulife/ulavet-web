import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

const pt_opts = {
  config: {
    forward: ["dataLayer.push"]
  }
};

export default defineConfig({
  site: "https://www.ulavet.com",
  integrations: [tailwind(), sitemap(), partytown(pt_opts)]
});