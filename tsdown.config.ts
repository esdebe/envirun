import { defineConfig } from 'tsdown'

export default defineConfig({
  alias: {
    '~': './src',
  },
  clean: true,
  deps: {
    onlyBundle: false,
    alwaysBundle: ['@clack/prompts', 'fast-glob', 'tinyexec'],
  },
  dts: true,
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  minify: {
    mangle: {
      toplevel: true,
    },
    compress: true,
  },
  outputOptions: {
    comments: {
      legal: false,
    },
  },
  platform: 'node',
  sourcemap: false,
  unbundle: false,
})
