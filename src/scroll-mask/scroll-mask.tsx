import React, { RefObject, useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useThrottleFn } from 'ahooks'
import classNames from 'classnames'

const classPrefix = 'uabm-scroll-mask'

export type ScrollMaskProps = {
  scrollTrackRef: RefObject<HTMLElement>
}

export const ScrollMask: React.FC<ScrollMaskProps> = props => {
  const maskRef = useRef<HTMLDivElement>(null)

  const [{ leftMaskOpacity, rightMaskOpacity }, api] = useSpring(() => ({
    leftMaskOpacity: 0,
    rightMaskOpacity: 0,
    config: {
      clamp: true,
    },
  }))

  // 节流
  const { run: updateMask } = useThrottleFn(
    (immediate = false) => {
      const mask = maskRef.current
      if (!mask) {
        return
      }
      const scrollEl = props.scrollTrackRef.current
      if (!scrollEl) {
        return
      }

      const scrollLeft = scrollEl.scrollLeft
      const showLeftMask = scrollLeft > 0
      const showRightMask = scrollLeft + scrollEl.offsetWidth < scrollEl.scrollWidth

      api.start({
        leftMaskOpacity: showLeftMask ? 1 : 0,
        rightMaskOpacity: showRightMask ? 1 : 0,
        immediate,
      })
    },
    {
      wait: 100,
      trailing: true,
      leading: true,
    }
  )

  // 初始化滚动蒙版
  useEffect(() => {
    updateMask(true)
  }, [])

  // 监听滚动条滚动时触发滚动蒙版更新
  useEffect(() => {
    const scrollEl = props.scrollTrackRef.current
    if (!scrollEl) {
      return
    }

    scrollEl.addEventListener('scroll', updateMask)
    return () => scrollEl.removeEventListener('scroll', updateMask)
  }, [])

  return (
    <>
      <animated.div
        ref={maskRef}
        className={classNames(classPrefix, `${classPrefix}-left`)}
        style={{ opacity: leftMaskOpacity }}
      />
      <animated.div
        ref={maskRef}
        className={classNames(classPrefix, `${classPrefix}-right`)}
        style={{ opacity: rightMaskOpacity }}
      />
    </>
  )
}
