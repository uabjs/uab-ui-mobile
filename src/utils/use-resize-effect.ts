import { useIsomorphicLayoutEffect, useMemoizedFn } from 'ahooks'
import { RefObject } from 'react'

/** 监听窗口大小出发effect */
export function useResizeEffect<T extends HTMLElement>(
  effect: (target: T) => void,
  targetRef: RefObject<T>
) {
  // useMemoizedFn: 保证函数地址永远不会变化。
  const fn = useMemoizedFn(effect)
  // 渲染页面前执行，防止闪屏
  useIsomorphicLayoutEffect(() => {
    const target = targetRef.current
    if (!target) {
      return
    }
    if (window.ResizeObserver) {
      let animationFrame: number
      // 元素尺寸变化执行的回调
      const observer = new ResizeObserver(() => {
        animationFrame = window.requestAnimationFrame(() => fn(target))
      })
      // 监听元素尺寸变化
      observer.observe(target)

      // 组件销毁时销毁副作用
      return () => {
        window.cancelAnimationFrame(animationFrame)
        observer.disconnect()
      }
    } else {
      fn(target)
    }
  }, [targetRef])
}
