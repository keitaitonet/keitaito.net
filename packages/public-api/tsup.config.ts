import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  clean: true,
  minify: true,
  treeshake: true,
});
