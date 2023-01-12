import { defineConfig } from 'father'
import path from 'path'
// const path = require('path')

export default defineConfig({
  esm: {},
  cjs: {},
  umd: {},
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  platform: 'browser',
  plugins: ['./scripts/publish-father-plugin'],
})
