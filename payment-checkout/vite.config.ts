import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: fileURLToPath(new URL("./src/setupTests.ts", import.meta.url)),
    coverage: {
      provider: "v8", // o 'istanbul'
      reporter: ["text", "json", "html"],
      // AQUÍ DEFINES EL MÍNIMO
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
