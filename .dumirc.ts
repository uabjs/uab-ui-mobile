import { defineConfig } from 'dumi'
import { nav } from "./config/nav";
import { sidebar } from "./config/sidebar";

exports.default = defineConfig({
  themeConfig: {
    name: 'uab ui Mobile',
    logo: 'https://avatars.githubusercontent.com/u/73016681?s=200&v=4',
    nav,
    sidebar,
    hd: {
      rules: [],
    },
    deviceWidth: 375,
  },
  locales: [
    { id: 'zh', name: '中文' },
    { id: 'en', name: 'English' },
  ],
  resolve: {
    docDirs: ['docs'],
    atomDirs: [{ type: 'component', dir: 'src' }],
    codeBlockMode: 'passive',
  },
  favicons: ['https://avatars.githubusercontent.com/u/73016681?s=88&v=4'],
  metas: []
})
