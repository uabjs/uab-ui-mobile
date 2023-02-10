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
        { title: 'JumboTabs 复杂选项卡', link: 'components/jumbo-tabs' },
        { title: 'NavBar 导航栏', link: 'components/nav-bar' },
        { title: 'SideBar 侧边导航', link: 'components/side-bar' },
        { title: 'TabBar 标签栏', link: 'components/tab-bar' },
        { title: 'Tabs 标签页', link: 'components/tabs' },
      ],
    },
    {
      title: '信息展示',
      children: [
        { title: 'Avatar 头像', link: '/components/avatar' },
        { title: 'List 列表', link: '/components/list' },
        { title: 'Image 图片', link: '/components/image' },
        { title: 'ImageViewer 图片查看器', link: '/components/image-viewer' },
      ],
    },
    {
      title: '反馈',
      children: [
        { title: 'Loading 加载中', link: '/components/loading' },
        { title: 'Mask 背景蒙层', link: '/components/mask' }
      ],
    },
    {
      title: '引导提示',
      children: [{ title: 'Badge 徽标', link: '/components/badge' }],
    },
    {
      title: '试验性',
      children: [{ title: 'ScrollMask 滚动两侧遮罩', link: '/components/scroll-mask' }],
    },
  ],
}
