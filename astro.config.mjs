import { defineConfig } from "astro/config";
import data from "./portfolio_data.json" with { type: "json" };
const url = new URL(process.env.SITE_URL || data.contact.portfolio);
export default defineConfig({
  site: url.origin,
  base: process.env.BASE_PATH ?? url.pathname,
  output: "static",
});
