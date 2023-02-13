import { canUseDom } from './can-use-dom'

// 作用： 随便添加一个事件侦听器（如 test-passive）目的就是测试浏览器是否读取第三个对象参数opts内的 passive，如果触发get说明浏览器支持该属性
export let supportsPassive = false

// 可以使用 dom api
if (canUseDom) {
  try {
    const opts = {}
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true
      },
    })
    window.addEventListener('test-passive', null as any, opts)
  } catch (e) {}
}
