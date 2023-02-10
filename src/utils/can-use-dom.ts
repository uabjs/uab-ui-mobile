/** 判断是否可以使用浏览器 dom */
export const canUseDom = !!(
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  window.document &&
  window.document.createElement
)
