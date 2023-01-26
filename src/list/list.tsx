import React, { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'
import classNames from 'classnames'

const classPrefix = `uabm-list`

export type ListProps = {
  header?: ReactNode
  mode?: 'default' | 'card' // 默认是整宽的列表，card 模式下展示为带 margin 和圆角的卡片
  children?: ReactNode
} & NativeProps<
  | '--active-background-color'
  | '--align-items'
  | '--border-bottom'
  | '--border-inner'
  | '--border-top'
  | '--extra-max-width'
  | '--font-size'
  | '--header-font-size'
  | '--padding-left'
  | '--padding-right'
  | '--prefix-padding-right'
  | '--prefix-width'
>

const defaultProps = {
  mode: 'default',
}

export type ListRef = {
  nativeElement: HTMLDivElement | null
}

// React.forwardRef 用于将父组件创建的 ref 引用关联到子组件中的任意元素上，也可以理解为子组件向父组件暴露 DOM 引用。
export const List = forwardRef<ListRef, ListProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const nativeElementRef = useRef<HTMLDivElement>(null)

  // useImperativeHandle: 使用ref时自定义暴露给父组件的实例值。
  useImperativeHandle(ref, () => ({
    get nativeElement() {
      return nativeElementRef.current
    },
  }))

  return withNativeProps(
    props,
    <div className={classNames(classPrefix, `${classPrefix}-${props.mode}`)} ref={nativeElementRef}>
      {props.header && <div className={`${classPrefix}-header`}>{props.header}</div>}
      <div className={`${classPrefix}-body`}>
        <div className={`${classPrefix}-body-inner`}>{props.children}</div>
      </div>
    </div>
  )
})
