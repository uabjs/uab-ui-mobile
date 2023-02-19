import { canUseDom } from './can-use-dom'

// 作用：获取当前运行环境 px 值真实大小
let tenPxTester: HTMLDivElement | null = null
let tester: HTMLDivElement | null = null

// 判断运行环境是否可以使用浏览器 dom api
if (canUseDom) {
  tenPxTester = document.createElement('div')
  tenPxTester.className = 'uabm-px-tester'
  tenPxTester.style.setProperty('--size', '10')
  document.body.appendChild(tenPxTester)
  tester = document.createElement('div')
  tester.className = 'uabm-px-tester'
  document.body.appendChild(tester)
}

/** 获取当前运行环境 px 值真实大小 */
export function convertPx(px: number) {
  // 还没有创建元素
  if (tenPxTester === null || tester === null) {
    return px
  }
  //  如果设置 height = 10px 获取的高 === 10 说明px值不变直接返回
  if (tenPxTester.getBoundingClientRect().height === 10) {
    return px
  }

  // 给 div 设置高度获取 px 值
  tester.style.setProperty('--size', px.toString())
  return tester.getBoundingClientRect().height
}
