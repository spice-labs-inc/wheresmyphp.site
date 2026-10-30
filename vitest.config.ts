import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#content": new URL("./src/content", import.meta.url).pathname,
      "#lib": new URL("./src/lib", import.meta.url).pathname
    }
  },
  test: {
    include: ["tests/**/*.test.ts"]
  }
});
