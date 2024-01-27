import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind(), react()],
  output: "hybrid",
  adapter: netlify(),
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
});
