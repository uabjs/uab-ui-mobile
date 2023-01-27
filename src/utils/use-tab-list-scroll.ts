import { RefObject } from 'react'
import { useSpring } from '@react-spring/web'
import { useIsomorphicLayoutEffect } from 'ahooks'
import { bound } from './bound'
import { useIsomorphicUpdateLayoutEffect } from './use-isomorphic-update-layout-effect'

export const useTabListScroll = (
  targetRef: RefObject<HTMLElement>,
  activeIndex: number | undefined
) => {
  // 创建一个单独的简单动画
  const [{ scrollLeft }, api] = useSpring(() => ({
    scrollLeft: 0,
    config: {
      tension: 300,
      clamp: true,
    },
  }))

  function animate(immediate = false) {
    const container = targetRef.current
    if (!container) {
      return
    }
    if (activeIndex === undefined) {
      return
    }
    // 点击的tab容器
    const activeTabWrapper = container.children.item(activeIndex) as HTMLDivElement
    const activeTab = activeTabWrapper.children.item(0) as HTMLDivElement
    const activeTabLeft = activeTab.offsetLeft
    const activeTabWidth = activeTab.offsetWidth
    // 滚动的容器
    const containerWidth = container.offsetWidth
    const containerScrollWidth = container.scrollWidth
    const containerScrollLeft = container.scrollLeft
    // 最大移动距离 = 滚动条的宽度 - list容器的宽度
    const maxScrollDistance = containerScrollWidth - containerWidth
    if (maxScrollDistance <= 0) {
      return
    }

    // 计算滚动条最终移动到的位置
    const nextScrollLeft = bound(
      // 滚动到的位置 = 新容器距离右边距离 - 新容器居中后的右侧距离
      activeTabLeft - (containerWidth - activeTabWidth) / 2,
      0, // 最小移动距离
      maxScrollDistance // 最大移动距离
    )

    api.start({
      scrollLeft: nextScrollLeft, // 滚动到的位置
      from: { scrollLeft: containerScrollLeft }, // 滚动的起始位置
      immediate: immediate && !scrollLeft.isAnimating, // true：立即滚动到该位置， false：有滚动动画
    })
  }

  // 在 SSR 模式下使用 useIsomorphicLayoutEffect ，因为使用 useLayoutEffect 会显示警告
  // useLayoutEffect：作用是当页面挂载或渲染完成时，再给你一次机会对页面进行修改。避免触发再次渲染
  // 作用：初次渲染默认滚动到选中tab
  useIsomorphicLayoutEffect(() => {
    animate(true)
  }, [])

  // 作用：监听点击tab改变时滚动居中该tab
  useIsomorphicUpdateLayoutEffect(() => {
    animate()
  }, [activeIndex])

  return {
    scrollLeft,
    animate,
  }
}
