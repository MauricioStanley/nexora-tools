/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Reuse Astro's Vite pipeline so `@/` aliases and `import.meta.glob` behave exactly as in the app.
export default getViteConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    testTimeout: 20_000,
  },
});
