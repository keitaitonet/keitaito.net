// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://keitaito.net",
  trailingSlash: "always",
  prefetch: {
    prefetchAll: true,
  },
  image: {
    layout: "constrained",
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith("/404/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Sans JP",
      cssVariable: "--font-noto-sans-jp",
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Noto Sans Mono",
      cssVariable: "--font-noto-sans-mono",
      fallbacks: ["monospace"],
    },
  ],
});
