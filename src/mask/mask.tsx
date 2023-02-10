import React, { FC, useMemo, useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useUnmountedRef } from 'ahooks'
import { ShouldRender } from '../utils/should-render'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { mergeProps } from '../utils/with-default-props'
import { GetContainer, renderToContainer } from '../utils/render-to-container'
import { PropagationEvent, withStopPropagation } from '../utils/with-stop-propagation'

const classPrefix = `uabm-mask`

const opacityRecord: Record<string, number> = {
  default: 0.55,
  thin: 0.35,
  thick: 0.75,
}

const colorRecord: Record<string, string> = {
  black: '0, 0, 0',
  white: '255, 255, 255',
}

export type MaskProps = {
  visible?: boolean
  onMaskClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  destroyOnClose?: boolean
  forceRender?: boolean
  disableBodyScroll?: boolean
  color?: 'white' | 'black' | (string & {})
  opacity?: 'default' | 'thin' | 'thick' | number
  getContainer?: GetContainer
  afterShow?: () => void
  afterClose?: () => void
  stopPropagation?: PropagationEvent[]
  children?: React.ReactNode
} & NativeProps<'--z-index'>

const defaultProps = {
  visible: true,
  destroyOnClose: false,
  forceRender: false,
  color: 'black',
  opacity: 'default',
  disableBodyScroll: true,
  getContainer: null,
  stopPropagation: ['click'],
}

export const Mask: FC<MaskProps> = p => {
  const props = mergeProps(defaultProps, p)
  // 组件是否卸载
  const unmountedRef = useUnmountedRef()
  // const { locale } = useConfig()

  // 显示遮罩层后禁止滚动
  const ref = useRef<HTMLDivElement>(null)

  // 得到遮罩层 rgba 背景色
  const background = useMemo(() => {
    const opacity = opacityRecord[props.opacity] ?? props.opacity
    const rgb = colorRecord[props.color]
    return rgb ? `rgba(${rgb}, ${opacity})` : props.color
  }, [props.color, props.opacity])

  const [active, setActive] = useState(props.visible)
  // 不透明度动画
  const { opacity } = useSpring({
    opacity: props.visible ? 1 : 0,
    coonfig: {
      precision: 0.01,
      mass: 1,
      tension: 250,
      friction: 30,
      clamp: true,
    },
    onStart: () => {
      setActive(true)
    },
    onRest: () => {
      if (unmountedRef.current) {
        return
      }
      setActive(props.visible)
      if (props.visible) {
        props.afterShow?.()
      } else {
        props.afterClose?.()
      }
    },
  })

  const node = withStopPropagation(
    props.stopPropagation,
    withNativeProps(
      props,
      <animated.div
        className={classPrefix}
        ref={ref}
        style={{
          ...props.style,
          background,
          opacity,
          display: active ? undefined : 'none',
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          if (e.target === e.currentTarget) {
            props.onMaskClick?.(e)
          }
        }}
      >
        {props.onMaskClick && (
          // 无障碍提示按钮
          <div
            className={`${classPrefix}-aria-button`}
            role='button'
            // aria-label={locale.Mask.name}
          />
        )}
        <div className={`${classPrefix}-content`}>{props.children}</div>
      </animated.div>
    )
  )

  return (
    <ShouldRender
      active={active}
      forceRender={props.forceRender}
      destroyOnClose={props.destroyOnClose}
    >
      {renderToContainer(props.getContainer, node)}
    </ShouldRender>
  )
}
