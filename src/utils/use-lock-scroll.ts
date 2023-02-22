import { useEffect, RefObject } from 'react'
import { useTouch } from './use-touch'
import { supportsPassive } from './supports-passive'
import { getScrollParent } from './get-scroll-parent'

const BODY_LOCK_CLASS = 'uabm-overflow-hidden'

let totalLockCount = 0

/** 获取可滚动元素 */
function getScrollableElement(el: HTMLElement | null) {
  let current = el?.parentElement

  while (current) {
    if (current.clientHeight < current.scrollHeight) {
      return current
    }
    current = current.parentElement
  }

  return null
}

// 移植自vant：https://github.com/youzan/vant/blob/main/packages/vant/src/composables/use-lock-scroll.ts
/** 锁定滚动事件  */
export function useLockScroll(rootRef: RefObject<HTMLElement>, shouldLock: boolean | 'strict') {
  const touch = useTouch()

  const onTouchMove = (event: TouchEvent) => {
    touch.move(event)

    const direction = touch.deltaY.current > 0 ? '10' : '01'
    const el = getScrollParent(event.target as Element, rootRef.current) as HTMLElement
    if (!el) return

    // 这有性能成本，但我们必须与 iOS 12 兼容
    if (shouldLock === 'strict') {
      const scrollableParent = getScrollableElement(event.target as HTMLElement)
      if (scrollableParent === document.body || scrollableParent === document.documentElement) {
        event.preventDefault()
        return
      }
    }

    const { scrollHeight, offsetHeight, scrollTop } = el
    let status = '11'

    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01'
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10'
    }

    // 如果是向下滑的滚动，则禁止执行默认事件
    if (status !== '11' && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
      if (event.cancelable) {
        event.preventDefault()
      }
    }
  }

  const lock = () => {
    //通过判断滚动动作给出不同的应对逻辑
    document.addEventListener('touchstart', touch.start)
    // 显示 Mask 背景蒙层时禁止触屏滚动
    document.addEventListener(
      'touchmove',
      onTouchMove,
      // passive: false：表示 onTouchMove 内会调用 preventDefault 方法。（默认浏览器 passive: true 表示不会调用 preventDefault 方法，所以就算写了 preventDefault 也不会生效）
      // false: 表示阻止事件冒泡
      supportsPassive ? { passive: false } : false
    )

    // 第一次执行给 body 添加名为 uabm-overflow-hidden 的 class
    if (!totalLockCount) {
      document.body.classList.add(BODY_LOCK_CLASS)
    }
    totalLockCount++
  }

  const unlock = () => {
    if (totalLockCount) {
      document.removeEventListener('touchstart', touch.start)
      document.removeEventListener('touchmove', onTouchMove)

      totalLockCount--

      // 全局都不存在使用 lock 的地方就删除 body class 上的 uabm-overflow-hidden
      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS)
      }
    }
  }

  useEffect(() => {
    if (shouldLock) {
      lock()
      return () => {
        unlock()
      }
    }
  }, [shouldLock])
}
