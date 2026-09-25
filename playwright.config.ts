import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: { baseURL: "http://localhost:4321/Portfolio/", headless: true },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4321/Portfolio/",
    reuseExistingServer: true,
    timeout: 120000,
  },
  reporter: "list",
});
