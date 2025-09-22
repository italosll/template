/// <reference types="vitest" />

import angular from "@analogjs/vite-plugin-angular";

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [angular(), nxViteTsPaths()],
    build:{
      sourcemap:true,
    },

    test: {
      sourcemap: true,
      globals: true,
      // environment: "jsdom",
      setupFiles: ["src/test-setup.ts"],
      include: [

        "src/**/*.spec.ts",
        "src/**/*.test.ts",
        "**/*.spec.ts",
        "**/*.test.ts"
      ],
      reporters: ["default"],
      // inspectBrk: true,
      // fileParallelism: false,
      // testTimeout:0,
      
      browser: {
        enabled: true,
        name: 'chromium',
        ui:true,

        headless: false, // set to true in CI
        provider: 'playwright',
      },
    },
    define: {
      "import.meta.vitest": mode !== "production",
    },
  };
});
