import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    // Esta línea construye la ruta exacta al archivo sin errores de formato
    setupFiles: fileURLToPath(new URL("./src/setupTests.ts", import.meta.url)),
  },
});
