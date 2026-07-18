import angular from "@analogjs/vite-plugin-angular";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { defineConfig } from "vite";
import { playwright } from '@vitest/browser-playwright'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      angular(),
      nxViteTsPaths(),
      nxCopyAssetsPlugin(["*.md"]),
    ],
    build: {
      sourcemap: true,
    },
    test: {
      sourcemap: true,
      setupFiles: ["src/test-setup.ts"],
      browser: {
        enabled: true,
        name: "chromium",
        ui: true,
        headless: false, // set to true in CI
        provider: playwright(),
        instances: [
        { 
          browser: 'chromium' // Define your target browser here
        },
      ],
        

      },
      enabled: true,
      name: "chromium",
      ui: true,
      headless: false,
      globals: true,
      environment: "jsdom",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      reporters: ["default"],
      coverage: {
        reportsDirectory: "../../coverage/apps/client",
        provider: "v8" as const,
      },
    },
    define: {
      "import.meta.vitest": mode !== "production",
    },
  };
});
