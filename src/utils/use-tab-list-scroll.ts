import { RefObject } from 'react'
import { useSpring } from '@react-spring/web'
import { useIsomorphicLayoutEffect } from 'ahooks'
import { bound } from './bound'
import { useIsomorphicUpdateLayoutEffect } from './use-isomorphic-update-layout-effect'

export const useTabListScroll = (targetRef: RefObject<HTMLElement>, activeIndex: number | undefined) => {
  const [{ scrollLeft }, api] = useSpring(() => ({
    scrollLeft: 0,
    config: {
      tension: 300,
      clamp: true,
    },
  }))

  console.log('scrollLeft===', scrollLeft)
  console.log('api===', api)

  function animate(immediate = false) {
    const container = targetRef.current
    if (!container) {
      return
    }
    if (activeIndex === undefined) {
      return
    }
    // 新容器
    const activeTabWrapper = container.children.item(activeIndex) as HTMLDivElement
    const activeTab = activeTabWrapper.children.item(0) as HTMLDivElement
    const activeTabLeft = activeTab.offsetLeft
    const activeTabWidth = activeTab.offsetWidth
    // 旧容器
    const containerWidth = container.offsetWidth
    const containerScrollWidth = container.scrollWidth
    const containerScrollLeft = container.scrollLeft

    const maxScrollDistance = containerScrollWidth - containerWidth
    if (maxScrollDistance <= 0) {
      return
    }

    // 对比得到滚动条最终需要移动的距离
    const nextScrollLeft = bound(
      // 需要移动的距离 = 新容器右边距离 - 新旧两个容器相差的半个宽度
      activeTabLeft - (containerWidth - activeTabWidth) / 2,
      0, // 最小移动距离
      // 最大移动距离 = 当前滚动条的宽度 - 旧容器的宽度
      containerScrollWidth - containerWidth
    )

    // 移动
    api.start({
      scrollLeft: nextScrollLeft,
      from: { scrollLeft: containerScrollLeft },
      immediate: immediate && !scrollLeft.isAnimating,
    })
  }

  // 在 SSR 模式下使用 useIsomorphicLayoutEffect ，因为使用 useLayoutEffect 会显示警告
  // useLayoutEffect：作用是当页面挂载或渲染完成时，再给你一次机会对页面进行修改。避免触发再次渲染
  useIsomorphicLayoutEffect(() => {
    animate(true)
  }, [])

  useIsomorphicUpdateLayoutEffect(() => {
    animate()
  }, [activeIndex])

  return {
    scrollLeft,
    animate,
  }
}
