/// <reference types="vitest" />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    globals: true,
  },
  build: {
    lib: {
      name: "@lib/validator",
      formats: ["umd"],
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
    },
  },
  plugins: [dts()],
});
