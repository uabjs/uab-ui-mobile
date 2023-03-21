import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import { useClickAway, useIsomorphicLayoutEffect } from 'ahooks'
import {
  arrow,
  computePosition,
  flip,
  offset,
  autoUpdate,
  hide,
  shift,
  limitShift,
} from '@floating-ui/dom'
import { PropagationEvent, withStopPropagation } from '../utils/with-stop-propagation'
import { GetContainer } from '../utils/get-container'
import { DeprecatedPlacement, Placement } from './index'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { mergeProps } from '../utils/with-default-props'
import { useShouldRender } from '../utils/should-render'
import { usePropsValue } from '../utils/use-props-value'
import { renderToContainer } from '../utils/render-to-container'
import { convertPx } from '../utils/convert-px'
import { Wrapper } from './wrapper'
import { Arrow } from './arrow'
import { normalizePlacement } from './normalize-placement'

const classPrefix = `uabm-popover`

export type PopoverProps = {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  getContainer?: GetContainer
  destroyOnHide?: boolean
  children: ReactElement
  mode?: 'light' | 'dark'
  trigger?: 'chick'
  placement?: Placement | DeprecatedPlacement
  stopPropagation?: PropagationEvent[]
  content: ReactNode
} & NativeProps<'--z-index'>

export type PopoverRef = {}

const defaultProps = {
  defaultVisible: false,
  trigger: 'chick',
  placement: 'top' as Placement,
  stopPropagation: ['chick'],
  getContainer: () => document.body,
}

export const Popover = forwardRef<PopoverRef, PopoverProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const { mode = 'light' } = props

  const [visible, setVisible] = usePropsValue<boolean>({
    value: props.visible,
    defaultValue: props.defaultVisible,
    onChange: props.onVisibleChange,
  })

  // 暴露给父组件的属性
  useImperativeHandle(
    ref,
    () => {
      return {
        show: () => setVisible(true),
        hide: () => setVisible(false),
        visible,
      }
    },
    [visible]
  )

  const targetRef = useRef<Wrapper>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  const floating = withStopPropagation(
    props.stopPropagation,
    withNativeProps(
      props,
      <div
        className={classNames(
          classPrefix,
          `${classPrefix}-${mode}`,
          !visible && `${classPrefix}-hidden`
        )}
        ref={floatingRef}
      >
        {/* 气泡箭头始终居中显示 */}
        <div className={`${classPrefix}-arrow`} ref={arrowRef}>
          <Arrow className={`${classPrefix}-arrow-icon`} />
        </div>
        {/* 气泡内容 */}
        <div className={`${classPrefix}-inner`}>
          <div className={`${classPrefix}-inner-content`}>{props.content}</div>
        </div>
      </div>
    )
  )

  const [targetElement, setTargetElement] = useState<Element | null>(null)
  const placement = normalizePlacement(props.placement)

  async function update() {
    const target = targetRef.current?.element ?? null
    const floating = floatingRef.current
    const arrowElement = arrowRef.current
    setTargetElement(target)
    if (!target || !floating || !arrowElement) return

    // 计算出气泡的 x, y 轴，位置信息，气泡箭头的 x, y 轴 等数据
    const {
      x,
      y,
      placement: realPlacement,
      middlewareData,
    } = await computePosition(target, floating, {
      placement,
      middleware: [
        offset(convertPx(12)), // 气泡和按钮的间隙
        shift({
          padding: convertPx(4),
          crossAxis: false,
          limiter: limitShift(),
        }),
        flip(),
        hide(),
        arrow({
          element: arrowElement,
          padding: convertPx(12),
        }),
      ],
    })

    // 设置气泡位置
    Object.assign(floating.style, {
      left: `${x}px`,
      top: `${y}px`,
    })

    // 位置方向取反
    const side = realPlacement.split('-')[0] as string
    const arrowSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side] as string

    // 设置气泡箭头位置
    const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {}
    Object.assign(arrowElement.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY !== null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [arrowSide]: `-${convertPx(8)}px`,
    })

    // 设置气泡箭头 icon 旋转角度 var 变量
    const arrowRotate = {
      top: '0deg',
      bottom: '180deg',
      left: '270deg',
      right: '90deg',
    }[side] as string
    arrowElement.style.setProperty('--arrow-icon-rotate', arrowRotate)
  }

  // 渲染页面前执行，防止闪屏
  useIsomorphicLayoutEffect(() => {
    // 计算气泡的位置
    update()
  })

  // 给气泡按钮添加点击事件，点击时弹出气泡
  useEffect(() => {
    if (!targetElement) return
    if (!props.trigger) return

    function handleClick() {
      setVisible(v => !v)
    }
    targetElement.addEventListener('click', handleClick)
    return () => {
      targetElement.removeEventListener('click', handleClick)
    }
  }, [targetElement, props.trigger])

  // 监听页面滚动，更新气泡位置
  useEffect(() => {
    const floatingElement = floatingRef.current
    if (!targetElement || !floatingElement) return
    return autoUpdate(targetElement, floatingElement, update, {
      // 使用 ResizeObserver 监听单个元素尺寸变化
      // elementResize文档：https://floating-ui.com/docs/autoUpdate#elementresize
      elementResize: typeof ResizeObserver !== 'undefined',
    })
  }, [targetElement])

  // 点击或触摸其他地方关闭气泡
  // useClickAway 的作用是监听目标元素外的点击事件
  useClickAway(
    () => {
      if (!props.trigger) return
      setVisible(false)
    },
    [() => targetRef.current?.element, floatingRef],
    ['click', 'touchmove']
  )

  const shouldRender = useShouldRender(visible, false, props.destroyOnHide)

  return (
    <>
      <Wrapper ref={targetRef}>{props.children}</Wrapper>
      {shouldRender && renderToContainer(props.getContainer, floating)}
    </>
  )
})
