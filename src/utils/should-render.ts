import React, { ReactElement } from 'react'
import { useInitialized } from './use-initialized'

interface ShouldRenderProps {
  active: boolean
  forceRender?: boolean // 被隐藏时是否渲染 DOM 结构
  destroyOnClose?: boolean // 不可见时是否卸载内容
  children: ReactElement
}

/** 公用渲染函数：通过参数判断子元素显示与否 */
export const ShouldRender: React.FC<ShouldRenderProps> = props => {
  const ShouldRender = useShouldRender(props.active, props.forceRender, props.destroyOnClose)
  // props.children：表示渲染内容, null：表示卸载内容
  return ShouldRender ? props.children : null
}

export function useShouldRender(active: boolean, forceRender?: boolean, destroyOnClose?: boolean) {
  const initialized = useInitialized(active)

  // 被隐藏时渲染 DOM 结构，强制渲染内容，内容的显示与否由 children 的 css 控制
  if (forceRender) {
    return true
  }

  // tab活动时渲染
  if (active) {
    return true
  }

  //没有初始化过
  if (!initialized) {
    return false
  }

  return !destroyOnClose
}
