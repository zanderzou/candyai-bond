import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://candyai.bond",
  output: "static",
  outDir: "./dist/client",
  trailingSlash: "always",
  integrations: [sitemap()],
  build: { format: "directory" },
});
