import { ReactElement, ReactPortal } from 'react'
import { createPortal } from 'react-dom'
import { canUseDom } from './can-use-dom'
import { resolveContainer } from './get-container'

export type GetContainer = HTMLElement | (() => HTMLElement) | null

/** 将参数2渲染到参数1获取到的容器中，默认渲染到 document.body */
export function renderToContainer(getContainer: GetContainer, node: ReactElement) {
  if (canUseDom && getContainer) {
    const container = resolveContainer(getContainer)
    // createPortal： 渲染 node 元素到 container 中
    return createPortal(node, container) as ReactPortal
  }
  return node
}
