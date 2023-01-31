import React, { CSSProperties, FC, Fragment, ReactNode } from 'react'
import { NativeProps, withNativeProps } from '../utils/native-props'
import classNames from 'classnames'

const classPrefix = `uabm-badge`

export const dot = <Fragment />

export type BadgeProps = {
  bordered?: boolean
  color?: string
  content?: ReactNode | typeof dot
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
  children?: ReactNode
} & NativeProps<'--right' | '--top' | '--color'>

export const Badge: FC<BadgeProps> = props => {
  const { content, children, bordered, color } = props

  const isDot = content === dot

  const element =
    content || content === 0
      ? withNativeProps(
          props,
          <div
            className={classNames(classPrefix, {
              [`${classPrefix}-fixed`]: !!children,
              [`${classPrefix}-dot`]: isDot,
              [`${classPrefix}-bordered`]: bordered,
            })}
            style={
              {
                '--color': color,
              } as BadgeProps['style']
            }
          >
            {/* 如果 content 不是 Badge.dot 就显示该内容 */}
            {!isDot && <div className={`${classPrefix}-content`}>{content}</div>}
          </div>
        )
      : null

  // 有子元素 children, Badge 就默认显示在子元素的右上角， 没有就只显示 Badge 小红点
  return children ? (
    <div
      className={classNames(`${classPrefix}-wrapper`, props.wrapperClassName)}
      style={props.wrapperStyle}
    >
      {children}
      {element}
    </div>
  ) : (
    element
  )
}
