import { defineConfig } from "vitest/config";

// Unit + integration tests (spec Testing Strategy). Integration tests that hit a test database
// should guard on DATABASE_URL and run against a disposable DB.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "server/src/**/*.test.ts"],
    environment: "node",
    globals: true,
  },
});
