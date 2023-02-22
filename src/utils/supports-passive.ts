import { canUseDom } from './can-use-dom'

/* 浏览器是否支持事件的属性 passive 属性
  passive: false：表示回调内会调用 preventDefault 方法。
  passive: true (默认)：表示不会调用 preventDefault 方法，所以回调内就算写了 preventDefault 也不会生效）
*/
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
    // 随便添加一个事件侦听器（如 test-passive）目的就是测试浏览器是否读取第三个对象参数opts内的 passive，如果触发get说明浏览器支持该属性
    window.addEventListener('test-passive', null as any, opts)
  } catch (e) {}
}
