// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  // Tell Vite that your source files live in "src"
  //  root: resolve(__dirname, "src"),
  base: "./",
  plugins: [
    react(),
    // Copy the manifest file/folder from the src root (remember: now the root is "src")
    viteStaticCopy({
      targets: [
        {
          src: "src/manifest/manifest.json", // relative to the root (src/manifest)
          dest: "", // it will be copied to dist/manifest
        },
      ],
    }),
  ],
  build: {
    // Output directory outside of src
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Use keys that reflect the desired folder structure in the final build.
        // For example, "popup/index.html" here means that after build, the file will be at "dist/popup/index.html"
        "popup/index.html": resolve(__dirname, "src/popup/index.html"),
        // Similarly for the background script:
        "background/background": resolve(
          __dirname,
          "src/background/background.ts",
        ),
      },
      output: {
        // This will output "background/background.js" in dist.
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
