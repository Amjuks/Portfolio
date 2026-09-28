import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: { baseURL: "http://localhost:4321/Portfolio/", headless: true },
  webServer: {
    command: process.env.TEST_PRODUCTION ? "npm run preview" : "npm run dev",
    url: "http://localhost:4321/Portfolio/",
    reuseExistingServer: !process.env.TEST_PRODUCTION && !process.env.CI,
    timeout: 120000,
  },
  reporter: "list",
});
