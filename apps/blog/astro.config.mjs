// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

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
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Sans JP",
      cssVariable: "--font-noto-sans-jp",
      weights: ["300 700"],
      styles: ["normal"],
      subsets: ["japanese"],
      display: "swap",
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Noto Sans Mono",
      cssVariable: "--font-noto-sans-mono",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
});
