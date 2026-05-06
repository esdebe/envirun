import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  unbundle: false,
  minify: true,
  platform: 'node',
  clean: true,
  sourcemap: false,
  deps: {
    onlyBundle: false,
    alwaysBundle: ['@clack/prompts', 'fast-glob', 'tinyexec', 'zod'],
  },
})
