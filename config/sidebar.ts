export const sidebar = {
  '/guide': [
    {
      children: [{ title: '快速上手', link: '/guide/quick-start' }],
    },
  ],
  '/en/guide': [
    {
      children: [{ title: 'Quick Start', link: '/en/guide/quick-start' }],
    },
  ],
  '/components': [
    {
      title: '通用',
      children: [
        { title: 'Button 按钮', link: '/components/button' },
        { title: 'icon 按钮', link: '/components/icon' },
      ],
    },
    {
      title: '布局',
      children: [
        { title: 'AutoCenter 自动居中', link: '/components/auto-center' },
        { title: 'Divider 分割线', link: '/components/divider' },
        { title: 'Grid 栅格', link: '/components/grid' },
        { title: 'SafeArea 安全区', link: '/components/safe-area' },
        { title: 'Space 间距', link: '/components/space' },
      ],
    },
    {
      title: '导航',
      children: [
        { title: 'CapsuleTabs 胶囊选项卡', link: 'components/capsule-tabs' },
        { title: 'IndexBar 序列', link: 'components/index-bar' },
        { title: 'NavBar 导航栏', link: 'components/nav-bar' },
      ],
    },
    {
      title: '信息展示',
      children: [{ title: 'List 列表', link: '/components/list' }],
    },
    {
      title: '试验性',
      children: [{ title: 'ScrollMask 滚动两侧遮罩', link: '/components/scroll-mask' }],
    },
  ],
}
