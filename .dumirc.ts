import { defineConfig } from 'dumi'

exports.default = defineConfig({
  themeConfig: {
    name: 'uab ui Mobile',
    logo: 'https://avatars.githubusercontent.com/u/73016681?s=200&v=4',
    nav: {
      'zh': [
        { title: '指南', link: '/guide', order: 1 },
        { title: '组件', link: '/components', order: 2 }
      ],
      'en': [
        { title: '指南', link: '/guide', order: 1 },
        { title: '组件', link: '/en/components', order: 2 }
      ],
    },
    sidebar: {
      '/guide': [
        {
          title: '指南',
          children: [
            { title: '快速上手', link: '/guide/quick-start', order: 1, frontmatter: { title: '11111' } }
          ]
        }
      ]
    },
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
