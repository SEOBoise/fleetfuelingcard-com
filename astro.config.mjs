// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://fleetfuelingcard.com",
  trailingSlash: "always",
  build: {
    // Inline all CSS into HTML — eliminates render-blocking CSS request,
    // the #1 mobile perf killer.
    inlineStylesheets: "always",
    format: "directory",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
