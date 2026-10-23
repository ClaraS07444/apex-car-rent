import { defineConfig, devices } from "@playwright/test";

const desktop = { width: 1440, height: 900 };

// Test-Matrix nach PRD 17 / T-09: Chrome, Firefox, Safari (macOS und iOS)
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4321",
  },
  webServer: {
    command: "node scripts/serve-dist.mjs 4321",
    url: "http://localhost:4321/",
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: desktop },
    },
    {
      name: "desktop-firefox",
      use: { ...devices["Desktop Firefox"], viewport: desktop },
    },
    {
      name: "desktop-webkit",
      use: { ...devices["Desktop Safari"], viewport: desktop },
    },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
});
