import type { IApi } from '@umijs/types'

const COLOR_HEAD_SCP = `
(function () {
  var cache = localStorage.getItem('dumi:prefers-color');
  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var enums = ['light', 'dark', 'auto'];

  document.documentElement.setAttribute(
    'data-prefers-color-scheme',
    cache === enums[2]
      ? (isDark ? enums[1] : enums[0])
      : (enums.indexOf(cache) > -1 ? cache : enums[0])
  )
})();
`

export default (api: IApi) => {
  api.describe({
    key: 'set-data-prefers-color-scheme',
  })
  api.addHTMLHeadScripts(async () => [{ content: COLOR_HEAD_SCP }])
  // TUDO：layouts DemoLayout
  api.addHTMLStyles(() => [
    {
      content: `
    [data-prefers-color=dark] body {
      color: #e6e6e6;
      background-color: #0b0e13;
    }
    #root > .dumi-mobile-demo-layout {
      padding: 0;
      min-height: 100vh;
      box-sizing: border-box;
    }`,
    },
  ])
}
