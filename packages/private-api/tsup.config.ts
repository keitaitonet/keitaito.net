import { cp } from "node:fs/promises";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  format: ["cjs"],
  clean: true,
  minify: true,
  treeshake: true,
  noExternal: [/^(?!@aws-sdk\/).*/],
  platform: "node",
  target: "node24",
  sourcemap: true,
  esbuildPlugins: [
    {
      name: "copy-swagger-ui-static",
      setup(build) {
        build.onEnd(async () => {
          await cp("node_modules/@fastify/swagger-ui/static", "dist/static", {
            recursive: true,
          });
        });
      },
    },
  ],
});
