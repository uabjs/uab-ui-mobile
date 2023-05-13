import { RightOutline } from 'antd-mobile-icons'
import classNames from 'classnames'
import React, { ReactNode, MouseEvent } from 'react'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { isNodeWithContent } from '../utils/is-node-with-content'

const classPrefix = `uabm-list-item`

export type ListItemProps = {
  title?: ReactNode
  children?: ReactNode
  description?: ReactNode
  prefix?: ReactNode
  extra?: ReactNode
  clickable?: boolean
  arrow?: boolean | ReactNode
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLElement>) => void
} & NativeProps<'--prefix-width' | '--align-items' | '--active-background-color'>

export const ListItem: React.FC<ListItemProps> = props => {
  const clickable = props.clickable ?? !!props.onClick
  const arrow = props.arrow === undefined ? clickable : props.arrow

  const content = (
    <div className={`${classPrefix}-content`}>
      {isNodeWithContent(props.prefix) && (
        <div className={`${classPrefix}-content-prefix`}>{props.prefix}</div>
      )}
      <div className={`${classPrefix}-content-main`}>
        {isNodeWithContent(props.title) && (
          <div className={`${classPrefix}-title`}>{props.title}</div>
        )}
        {props.children}
        {isNodeWithContent(props.description) && (
          <div className={`${classPrefix}-description`}>{props.description}</div>
        )}
      </div>
      {isNodeWithContent(props.extra) && (
        <div className={`${classPrefix}-content-extra`}>{props.extra}</div>
      )}
      {isNodeWithContent(arrow) && (
        <div className={`${classPrefix}-content-arrow`}>
          {arrow === true ? <RightOutline /> : arrow}
        </div>
      )}
    </div>
  )

  return withNativeProps(
    props,
    // 可点击使用 a标签，否则使用 div标签
    React.createElement(
      clickable ? 'a' : 'div',
      {
        className: classNames(
          `${classPrefix}`,
          clickable ? ['uabm-plain-anchor'] : [],
          props.disabled && `${classPrefix}-disabled`
        ),
        onClick: props.disabled ? undefined : props.onClick,
      },
      content
    )
  )
}
