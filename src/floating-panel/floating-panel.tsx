import React, { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useMemoizedFn } from 'ahooks'
import { supportsPassive } from '../utils/supports-passive'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { mergeProps } from '../utils/with-default-props'
import { nearest } from '../utils/nearest'
import { useLockScroll } from '../utils/use-lock-scroll'

const classPrefix = `uabm-floating-panel`

export type FloatingPanelRef = {
  setHeight: (
    height: number,
    options?: {
      immediate?: boolean
    }
  ) => void
}

export type FloatingPanelProps = {
  anchors: number[]
  children: ReactNode
  handleDraggingOfContent?: boolean
  onHeightChange?: (height: number, animating: boolean) => void
} & NativeProps<'--border-redius' | '--z-index' | '--header-height'>

const defaultProps = {
  handleDraggingOfContent: true,
}

export const FloatingPanel = forwardRef<FloatingPanelRef, FloatingPanelProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const { anchors } = props
  const possibles = anchors.map(x => -x)
  const maxHeight = anchors[anchors.length - 1] ?? window.innerHeight

  // 运动范围
  const bounds = {
    top: possibles[possibles.length - 1],
    bottom: possibles[0],
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onHeightChange = useMemoizedFn(props.onHeightChange ?? (() => {}))

  const [{ y }, api] = useSpring(() => ({
    y: bounds.bottom, // 初始高度
    config: { tension: 300 },
    onChange: result => {
      onHeightChange(-result.value.y, y.isAnimating)
    },
  }))

  const elementRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pullingRef = useRef(false)
  const [pulling, setPulling] = useState(false)

  useDrag(
    state => {
      const [, offsetY] = state.offset
      if (state.first) {
        const target = state.event.target as Element
        const header = headerRef.current
        if (header === target || header?.contains(target)) {
          // 说明拖拽到是头部
          pullingRef.current = true
        } else {
          // 说明拖拽到是身体
          if (!props.handleDraggingOfContent) return
          const reachedTop = y.goal <= bounds.top
          const content = contentRef.current
          if (!content) return
          if (reachedTop) {
            if (content.scrollTop <= 0 && state.direction[1] > 0) {
              pullingRef.current = true
            }
          } else {
            pullingRef.current = true
          }
        }
      }
      // pullingRef.current 存在才可以拖拽，不然就 return 退出
      setPulling(pullingRef.current)
      if (!pullingRef.current) return

      // 关闭默认事件，阻止冒泡
      const { event } = state
      if (event.cancelable) {
        event.preventDefault()
      }
      event.stopPropagation()

      // 当前拖拽到的位置
      let nextY = offsetY

      // 计算最后一次拖拽到的位置
      if (state.last) {
        pullingRef.current = false
        setPulling(false)
        nextY = nearest(possibles, offsetY)
      }
      api.start({
        y: nextY,
      })
    },
    {
      target: elementRef,
      axis: 'y', // 运动的坐标轴
      bounds, // 运动范围
      rubberband: true, // 超出范围橡皮筋效果
      from: () => [0, y.get()], // 起始位置
      pointer: { touch: true }, // 滚动时仍保持拖动
      // passive: false：表示 onTouchMove 内会调用 preventDefault 方法。（默认浏览器 passive: true 表示不会调用 preventDefault 方法，所以就算写了 preventDefault 也不会生效）
      // false: 表示阻止事件冒泡
      eventOptions: supportsPassive
        ? { passive: false }
        : (false as unknown as AddEventListenerOptions),
    }
  )

  useImperativeHandle(
    ref,
    () => ({
      setHeight: (
        height: number,
        options?: {
          immediate?: boolean
        }
      ) => {
        api.start({
          y: -height,
          immediate: options?.immediate,
        })
      },
    }),
    [api]
  )

  useLockScroll(elementRef, true)

  return withNativeProps(
    props,
    <animated.div
      ref={elementRef}
      className={classPrefix}
      style={{
        height: Math.round(maxHeight),
        translateY: y.to(y => `calc(100% + (${Math.round(y)}px))`),
      }}
    >
      {/* 拖拽时的透明拖拽层 */}
      <div
        className={`${classPrefix}-mask`}
        style={{
          display: pulling ? 'block' : 'none',
        }}
      />

      {/* 拖拽头部 */}
      <div ref={headerRef} className={`${classPrefix}-header`}>
        <div className={`${classPrefix}-bar`} />
      </div>
      {/* 内容 */}
      <div ref={contentRef} className={`${classPrefix}-content`}>
        {props.children}
      </div>
    </animated.div>
  )
})
