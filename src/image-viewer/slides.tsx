import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { convertPx } from '../utils/convert-px'
import { bound } from '../utils/bound'
import { Slide } from './slide'

const classPrefix = `uabm-image-viewer`

export type SlidesType = {
  images: string[]
  onTap: () => void
  maxZoom: number
  defaultIndex: number
  onIndexChange?: (index: number) => void
}

export type SlidesRef = {
  swipeTo: (index: number, immediate?: boolean) => void
}

/** Slides主要实现滑动切换图片效果，内部使用Slide来实现图片缩放效果 */
export const Slides = forwardRef<SlidesRef, SlidesType>((props, ref) => {
  const slideWidth = window.innerWidth + convertPx(16)

  const [{ x }, api] = useSpring(() => ({
    x: props.defaultIndex * slideWidth, // 当前x轴
    config: { tension: 250, clamp: true },
  }))

  const count = props.images.length

  function swipeTo(index: number, immediate = false) {
    const i = bound(index, 0, count - 1)
    props.onIndexChange?.(i)
    api.start({
      x: i * slideWidth,
      immediate,
    })
  }

  useImperativeHandle(ref, () => ({
    swipeTo,
  }))

  const dragLockRef = useRef(false)
  // useDrag文档：https://use-gesture.netlify.app/docs/
  const bind = useDrag(
    state => {
      if (dragLockRef.current) return
      const [offsetX] = state.offset

      // 松手时判断应该跳转到哪一张图片
      if (state.last) {
        const minIndex = Math.floor(offsetX / slideWidth)
        const maxIndex = minIndex + 1
        const velocityOffset = Math.min(state.velocity[0] * 2000, slideWidth) * state.direction[0]
        swipeTo(bound(Math.round((offsetX + velocityOffset) / slideWidth), minIndex, maxIndex))
      } else {
        api.start({
          x: offsetX,
          immediate: true,
        })
      }
    },
    // 配置文档：https://use-gesture.netlify.app/docs/options/
    {
      // 可以用于转换指针值的函数。用于将屏幕坐标映射到自定义空间坐标（如 canvas）。
      transform: ([x, y]) => [-x, y],
      // 起始点
      from: () => [x.get(), 0],
      // 将手势偏移限制在指定的范围内。
      bounds: () => {
        return {
          left: 0,
          right: (count - 1) * slideWidth,
        }
      },
      // 橡皮筋效果
      rubberband: true,
      // x 轴
      axis: 'x',
      // 滚动时仍保持拖动
      pointer: { touch: true },
    }
  )

  return (
    <div className={`${classPrefix}-slides`} {...bind()}>
      {/* 页标 */}
      <animated.div className={`${classPrefix}-indicator`}>
        {x.to(v => {
          const index: number = bound(Math.round(v / slideWidth), 0, count - 1)
          return `${index + 1} / ${count}`
        })}
      </animated.div>
      {/* 滚动图片 */}
      <animated.div className={`${classPrefix}-slides-inner`} style={{ x: x.to(x => -x) }}>
        {props.images.map((image, index) => (
          <Slide
            key={index}
            image={image}
            onTap={props.onTap}
            maxZoom={props.maxZoom}
            dragLockRef={dragLockRef}
            onZoomChange={zoom => {
              if (zoom !== 1) {
                const index: number = Math.round(x.get() / slideWidth)
                api.start({
                  x: index * slideWidth,
                })
              }
            }}
          />
        ))}
      </animated.div>
    </div>
  )
})
