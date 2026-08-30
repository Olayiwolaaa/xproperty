import { defineConfig, devices } from "@playwright/test";

/**
 * E2E + responsive verification (NFR-1). Runs each spec across the five required breakpoints
 * (360, 768, 1024, 1440, 1920) so "no horizontal scroll / broken layout" is enforced on every page,
 * form, dashboard, and the carousel.
 *
 * Uncomment `webServer` once the client dev/preview server is wired for CI.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile-360", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 } } },
    { name: "tablet-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "laptop-1024", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } } },
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "wide-1920", use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } } },
  ],
  // webServer: {
  //   command: "npm run preview",
  //   url: "http://localhost:4173",
  //   reuseExistingServer: !process.env.CI,
  // },
});
