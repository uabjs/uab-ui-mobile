import classNames from 'classnames'
import React from 'react'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'

const classPrefix = 'uabm-space'

export type SpaceProps = {
  align?: 'start' | 'end' | 'center' | 'baseline'
  block?: boolean
  direction?: 'horizontal' | 'vertical'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch'
  wrap?: boolean
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
} & NativeProps<'--gap' | '--gap-horizontal' | '--gap-vertical'>

const defaultProps = {
  direction: 'horizontal',
}

export const Space: React.FC<SpaceProps> = p => {
  const props = mergeProps(defaultProps, p)
  const { align, block, direction, justify, wrap, children, onClick } = props

  return withNativeProps(
    props,
    <div
      className={classNames(
        classPrefix,
        {
          [`${classPrefix}-align-${align}`]: !!align,
          [`${classPrefix}-block`]: block,
          [`${classPrefix}-justify-${justify}`]: !!justify,
          [`${classPrefix}-wrap`]: wrap,
        },
        `${classPrefix}-${direction}`
      )}
      onClick={onClick}
    >
      {React.Children.map(props.children, child => {
        return child !== null && child !== undefined && <div className={`${classPrefix}-item`}>{child}</div>
      })}
    </div>
  )
}
