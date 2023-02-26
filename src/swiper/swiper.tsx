import React, {
  ReactNode,
  CSSProperties,
  forwardRef,
  ReactElement,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from 'react'
import classNames from 'classnames'
import { staged } from 'staged-components'
import { useDrag } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { devWarning } from '../utils/dev-log'
import { bound } from '../utils/bound'
import { useRefState } from '../utils/use-ref-state'
import { mergeFuncProps } from '../utils/with-func-props'
import PageIndicator, { PageIndicatorProps } from '../page-indicator'
import { SwiperItem } from './swiper-item'

const classPrefix = `uabm-swiper`

const eventToPropRecord = {
  mousedown: 'onMouseDown',
  mousemove: 'onMouseMove',
  mouseup: 'onMouseUp',
} as const

type ValuesToUnion<T, K extends keyof T = keyof T> = K extends keyof T ? T[K] : never

type PropagationEvent = keyof typeof eventToPropRecord

export type SwiperRef = {
  swipeTo: (index: number) => void
  swipeNext: () => void
  swipePrev: () => void
}

export type SwiperProps = {
  defaultIndex?: number
  allowTouchMove?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  loop?: boolean
  direction?: 'horizontal' | 'vertical'
  onIndexChange?: (index: number) => void
  indicatorProps?: Pick<PageIndicatorProps, 'color' | 'style' | 'className'>
  indicator?: (total: number, current: number) => ReactNode
  slideSize?: number
  trackOffset?: number
  stuckAtBoundary?: boolean
  rubberband?: boolean
  stopPropagation?: PropagationEvent[]
  children?: ReactElement | ReactElement[]
} & NativeProps<'--height' | '--width' | '--border-radius' | '--track-padding'>

const defaultProps = {
  defaultIndex: 0,
  allowTouchMove: true,
  autoplay: false,
  autoplayInterval: 3000,
  loop: false,
  direction: 'horizontal',
  slideSize: 100,
  trackOffset: 0,
  stuckAtBoundary: true,
  rubberband: true,
  stopPropagation: [] as PropagationEvent[],
}

let currentUid: undefined | {}

export const Swiper = forwardRef<SwiperRef, SwiperProps>(
  staged<SwiperProps, SwiperRef>((p, ref) => {
    const props = mergeProps(defaultProps, p)
    const [uid] = useState({})
    const isVertical = props.direction === 'vertical'

    const slideRatio = props.slideSize / 100
    const offsetRatio = props.trackOffset / 100

    const { validChildren, count } = useMemo(() => {
      let count = 0
      const validChildren = React.Children.map(props.children, child => {
        if (!React.isValidElement(child)) return null
        if (child.type !== SwiperItem) {
          devWarning('Swiper', 'The children of `Swiper` must be `Swiper.Item` components.')
          return null
        }
        count++
        return child
      })

      return {
        validChildren,
        count,
      }
    }, [props.children])

    return () => {
      const loop = props.loop

      const style: CSSProperties & Record<'--slide-size' | '--track-offset', string> = {
        '--slide-size': `${props.slideSize}%`,
        '--track-offset': `${props.trackOffset}%`,
      }

      const [current, setCurrent] = useState(props.defaultIndex)
      const [dragging, setDragging, draggingRef] = useRefState(false)

      function boundIndex(current: number) {
        let min = 0
        let max = count - 1
        // 计算卡在边界处的拖动范围
        if (props.stuckAtBoundary) {
          min += offsetRatio / slideRatio
          max -= (1 - slideRatio - offsetRatio) / slideRatio
        }
        return bound(current, min, max)
      }

      const [{ position }, api] = useSpring(
        () => ({
          position: boundIndex(current) * 100,
          config: { tension: 200, friction: 30 },
          onRest: () => {
            if (draggingRef.current) return
            if (!loop) return
            const rawX = position.get()
            const totalWidth = 100 * count
            const standardPosition = modulus(rawX, totalWidth)
            if (standardPosition === rawX) return
            api.start({
              position: standardPosition,
              immediate: true, // 立即到目标点，不使用动画效果
            })
          },
        }),
        [count]
      )

      const dragCancelRef = useRef<(() => void) | null>(null)
      function forceCancelDrag() {
        dragCancelRef.current?.()
        draggingRef.current = false
      }

      const trackRef = useRef<HTMLDivElement>(null)
      function getSlidePixels() {
        const track = trackRef.current
        if (!track) return 0
        const trackPixels = isVertical ? track.offsetHeight : track.offsetWidth
        return (trackPixels * props.slideSize) / 100
      }

      const bind = useDrag(
        state => {
          // dragCancelRef.current = state.cancel
          // if (!state.intentional) return
          // if (state.first && !currentUid) {
          //   currentUid = uid
          // }
          // if (currentUid !== uid) return
          // currentUid = state.last ? undefined : uid

          const slidePixels = getSlidePixels()
          if (!slidePixels) return
          const paramIndex = isVertical ? 1 : 0
          const offset = state.offset[paramIndex]
          const direction = state.direction[paramIndex]
          const velocity = state.velocity[paramIndex]
          setDragging(true)
          if (!state.last) {
            // 拖拽时计算移动位置
            api.start({
              // 偏移位置百分比 = 运动位置（offset） / 轮播框宽度（slidePixels） * 100
              position: (offset * 100) / slidePixels,
              immediate: true,
            })
          } else {
            // 拖拽松开时计算移动位置
            const minIndex = Math.floor(offset / slidePixels)
            const maxIndex = minIndex + 1
            const index = Math.round((offset + velocity * 2000 * direction) / slidePixels)
            // 计算落到哪个 item 上
            swipeTo(bound(index, minIndex, maxIndex))
            window.setTimeout(() => {
              setDragging(false)
            })
          }
        },
        {
          // 反方向移动
          transform: ([x, y]) => [-x, -y],
          // 运动起始位置
          from: () => {
            const slidePixels = getSlidePixels()
            return [(position.get() / 100) * slidePixels, (position.get() / 100) * slidePixels]
          },
          // 触发所有事件
          triggerAllEvents: true,
          // 移动边界
          bounds: () => {
            if (loop) return {}
            const slidePixels = getSlidePixels()
            const lowerBound = boundIndex(0) * slidePixels
            const upperBound = boundIndex(count - 1) * slidePixels
            return isVertical
              ? {
                  top: lowerBound,
                  bottom: upperBound,
                }
              : {
                  left: lowerBound,
                  right: upperBound,
                }
          },
          // 移动出界橡皮筋效果
          rubberband: props.rubberband,
          // 移动的轴
          axis: isVertical ? 'y' : 'x',
          // 阻止滚动
          preventScroll: !isVertical,
          // 滚动时仍保持拖动
          pointer: { touch: true },
        }
      )

      // ref 暴露出去的方法
      function swipeTo(index: number, immediate = false) {
        const roundedIndex = Math.round(index)
        const targetIndex = loop ? modulus(roundedIndex, count) : bound(roundedIndex, 0, count - 1)
        setCurrent(targetIndex)
        api.start({
          position: (loop ? roundedIndex : boundIndex(roundedIndex)) * 100,
          immediate,
        })
      }

      function swipeNext() {
        swipeTo(Math.round(position.get() / 100) + 1)
      }

      function swipePrev() {
        swipeTo(Math.round(position.get() / 100) - 1)
      }

      useImperativeHandle(ref, () => ({
        swipeTo,
        swipeNext,
        swipePrev,
      }))

      const dragProps = { ...(props.allowTouchMove ? bind() : {}) }
      const stopPropagationProps: Partial<Record<ValuesToUnion<typeof eventToPropRecord>, any>> = {}
      for (const key of props.stopPropagation) {
        const prop = eventToPropRecord[key]
        stopPropagationProps[prop] = function (e: Event) {
          e.stopPropagation()
        }
      }
      const mergedProps = mergeFuncProps(dragProps, stopPropagationProps)

      function renderTrackInner() {
        if (loop) {
          return (
            <div className={`${classPrefix}-track-inner`}>
              {React.Children.map(validChildren, (child, index) => {
                return (
                  <animated.div
                    className={`${classPrefix}-slide`}
                    style={{
                      // 通过 left 和 transform 来单个单个控制每个 item 的位置
                      [isVertical ? 'y' : 'x']: position.to(position => {
                        let finalPosition = -position + index * 100
                        const totalWidth = count * 100
                        const flagWidth = totalWidth / 2
                        // 二分取模: 滚动循环核心算法
                        finalPosition = modulus(finalPosition + flagWidth, totalWidth) - flagWidth
                        return `${finalPosition}%`
                      }),
                      [isVertical ? 'top' : 'left']: `-${index * 100}%`,
                    }}
                  >
                    {child}
                  </animated.div>
                )
              })}
            </div>
          )
        } else {
          return (
            <animated.div
              className={`${classPrefix}-track-inner`}
              style={{
                [isVertical ? 'y' : 'x']: position.to(position => `${-position}%`),
              }}
            >
              {React.Children.map(validChildren, child => {
                return <div className={`${classPrefix}-slide`}>{child}</div>
              })}
            </animated.div>
          )
        }
      }

      return withNativeProps(
        props,
        <div className={classNames(classPrefix, `${classPrefix}-${props.direction}`)} style={style}>
          <div
            ref={trackRef}
            className={classNames(`${classPrefix}-track`, {
              [`${classPrefix}-track-allow-touch-move`]: props.allowTouchMove,
            })}
            // 冒泡捕获
            onClickCapture={e => {
              if (draggingRef.current) {
                e.stopPropagation()
              }
              forceCancelDrag()
            }}
            {...mergedProps}
          >
            {renderTrackInner()}
          </div>
          {props.indicator === undefined ? (
            <div className={`${classPrefix}-indicator`}>
              <PageIndicator
                {...props.indicatorProps}
                total={count}
                current={current}
                direction={props.direction}
              />
            </div>
          ) : (
            props.indicator(count, current)
          )}
        </div>
      )
    }
  })
)

/** 模数 */
function modulus(value: number, division: number) {
  const remainder = value % division
  return remainder < 0 ? remainder + division : remainder
}
