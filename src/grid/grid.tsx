import React from 'react'
import { toCSSLength } from '../utils/to-css-length'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'

const classPrefix = `uabm-grid`

export type GridProps = {
  columns: number
  gap?: number | string | [number | string, number | string]
  children?: React.ReactNode
} & NativeProps<'--gap' | '--gap-vertical' | '--gap-horizontal'>

export const Grid: React.FC<GridProps> = props => {
  const style: GridProps['style'] & Record<'--columns', string> = {
    '--columns': props.columns.toString(),
  }

  const { gap } = props
  if (gap !== undefined) {
    if (Array.isArray(gap)) {
      style['--gap-horizontal'] = toCSSLength(gap[0])
      style['--gap-vertical'] = toCSSLength(gap[1])
    } else {
      style['--gap'] = toCSSLength(gap)
    }
  }

  return withNativeProps(
    props,
    <div className={classPrefix} style={style}>
      {props.children}
    </div>
  )
}

export type GridItemProps = {
  span?: number
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  children?: React.ReactNode
} & NativeProps

type GridItemStyle = React.CSSProperties & Record<'--item-span', GridItemProps['span']>

export const GridItem: React.FC<GridItemProps> = p => {
  const props = mergeProps({ span: 1 }, p)
  const itemStyle: GridItemStyle = {
    '--item-span': props.span,
  }

  return withNativeProps(
    props,
    <div className={`${classPrefix}-item`} style={itemStyle} onClick={props.onClick}>
      {props.children}
    </div>
  )
}
