import React, {
  ReactNode,
  CSSProperties,
  forwardRef,
  ReactElement,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
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
      // dragging: ????????????????????????????????????????????????????????????????????? ?????????????????????
      const [dragging, setDragging, draggingRef] = useRefState(false)

      function boundIndex(current: number) {
        let min = 0
        let max = count - 1
        // ????????????????????????????????????
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
              immediate: true, // ??????????????????????????????????????????
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
          dragCancelRef.current = state.cancel
          if (!state.intentional) return

          // ???????????????????????????????????????????????????????????????????????????
          // ???????????????????????????????????????id??????????????????use-gesture??????event.stopPropagation???????????????????????????
          if (state.first && !currentUid) {
            currentUid = uid
          }
          if (currentUid !== uid) return
          currentUid = state.last ? undefined : uid

          const slidePixels = getSlidePixels()
          if (!slidePixels) return
          const paramIndex = isVertical ? 1 : 0
          const offset = state.offset[paramIndex]
          const direction = state.direction[paramIndex]
          const velocity = state.velocity[paramIndex]
          setDragging(true)
          if (!state.last) {
            // ???????????????????????????
            api.start({
              // ????????????????????? = ???????????????offset??? / ??????????????????slidePixels??? * 100
              position: (offset * 100) / slidePixels,
              immediate: true,
            })
          } else {
            // ?????????????????????????????????
            const minIndex = Math.floor(offset / slidePixels)
            const maxIndex = minIndex + 1
            const index = Math.round((offset + velocity * 2000 * direction) / slidePixels)
            // ?????????????????? item ???
            swipeTo(bound(index, minIndex, maxIndex))
            window.setTimeout(() => {
              setDragging(false)
            })
          }
        },
        {
          // ???????????????
          transform: ([x, y]) => [-x, -y],
          // ??????????????????
          from: () => {
            const slidePixels = getSlidePixels()
            return [(position.get() / 100) * slidePixels, (position.get() / 100) * slidePixels]
          },
          // ??????????????????
          triggerAllEvents: true,
          // ????????????
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
          // ???????????????????????????
          rubberband: props.rubberband,
          // ????????????
          axis: isVertical ? 'y' : 'x',
          // ????????????
          preventScroll: !isVertical,
          // ????????????????????????
          pointer: { touch: true },
        }
      )

      // ref ?????????????????????
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

      const { autoplay, autoplayInterval } = props
      useEffect(() => {
        if (!autoplay || dragging) return

        let interval: number
        function tick() {
          interval = window.setTimeout(tick, autoplayInterval)
          swipeNext()
        }
        interval = window.setTimeout(tick, autoplayInterval)

        return () => {
          if (interval) window.clearTimeout(interval)
        }
      }, [autoplay, autoplayInterval, dragging, count])

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
                      // ?????? left ??? transform ??????????????????????????? item ?????????
                      [isVertical ? 'y' : 'x']: position.to(position => {
                        let finalPosition = -position + index * 100
                        const totalWidth = count * 100
                        const flagWidth = totalWidth / 2
                        // ????????????: ????????????????????????
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
            // ????????????
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

/** ?????? */
function modulus(value: number, division: number) {
  const remainder = value % division
  return remainder < 0 ? remainder + division : remainder
}
