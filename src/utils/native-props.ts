import React, { AriaAttributes, CSSProperties, ReactElement } from 'react'
import classNames from 'classNames'

export type NativeProps<S extends string = never> = {
  className?: string
  style?: CSSProperties & Partial<Record<S, string>>
  tabIndex?: number
} & AriaAttributes


export function withNativeProps<P extends NativeProps>(props: P, element: ReactElement) {
  const _props = {
    ...element.props,
  }

  if (props.className) {
    _props.className = classNames(_props.className, props.className)
  }

  if (props.style) {
    _props.style = {..._props.style, ...props.style}
  }

  if (props.tabIndex !== undefined) {
    _props.tabIndex = props.tabIndex
  }

  // 合并 props 前缀为 'data-' 或 'aria-' 的  key 到 _props
  for (const key in props) {
    // 为什么判断一下是否存在该属性？
    // for in它将遍历原型链上的每个属性，包括您不知道的属性（可能是有人乱用对象原型添加的）
    // 添加 hasOwnProperty 判断可以保证只有那个对象实例本身的键。
    if (!props.hasOwnProperty(key)) { continue }
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      _props[key] = props[key]
    }
  }

  return React.cloneElement(element, _props)
}
