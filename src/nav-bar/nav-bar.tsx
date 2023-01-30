import React, { FC, ReactNode } from 'react'
import classNames from 'classnames'
import { LeftOutline } from 'antd-mobile-icons'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { mergeProps } from '../utils/with-default-props'

const classPrefix = `uabm-nav-bar`

export type NavBarProps = {
  back?: ReactNode
  backArrow?: boolean | ReactNode
  left?: ReactNode
  right?: ReactNode
  onBack?: () => void
  children?: ReactNode
} & NativeProps<'--height' | '--border-bottom'>

const defaultProps = {
  backArrow: true,
}

export const NavBar: FC<NavBarProps> = p => {
  const props = mergeProps(defaultProps, p)
  const { back, backArrow } = props

  return withNativeProps(
    props,
    <div className={classNames(classPrefix)}>
      {/* role='button' 可以使任何元素作为一个屏幕阅读器的按钮控件出现 */}
      <div className={`${classPrefix}-left`} role='button'>
        {
          // back 不全等于 null 时显示左侧返回按钮
          back !== null && (
            <div className={`${classPrefix}-back`} onClick={props.onBack}>
              {
                // backArrow 有值时显示箭头
                backArrow && (
                  <span className={`${classPrefix}-back-arrow`}>
                    {/* backArrow为true时默认显示箭头，否则显示自定义icon */}
                    {backArrow === true ? <LeftOutline /> : backArrow}
                  </span>
                )
              }
              {/* aria-hidden='true' 它将从无障碍树中删除该元素，这可以增强屏幕阅读器用户的体验。注意，它并没有在视觉上隐藏元素，它只针对屏幕阅读器用户。 */}
              <span aria-hidden='true'>{back}</span>
            </div>
          )
        }
        {props.left}
      </div>
      <div className={`${classPrefix}-title`}>{props.children}</div>
      <div className={`${classPrefix}-right`}>{props.right}</div>
    </div>
  )
}
