import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind(), react(), sitemap()],
  output: "hybrid",
  adapter: netlify(),
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
});
