import React, { ReactNode } from 'react'
import { findDOMNode } from 'react-dom'

// Wrapper 组件将子组件的 DOM 节点存储在 element 属性中。
// 使得父组件可以通过访问 Wrapper 组件的 element 属性来访问子组件的 DOM 节点，以便在必要时修改或操作它们。
export class Wrapper extends React.Component<
  {
    children?: ReactNode
  },
  {}
> {
  element: Element | null = null
  // 挂载后调用更新后钩子
  componentDidMount() {
    this.componentDidUpdate()
  }
  componentDidUpdate() {
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this) // 获取子组件的 dom 节点
    if (node instanceof Element) {
      this.element = node // 存储子组件的 dom 节点，共父组件使用
    } else {
      this.element = null
    }
  }

  render() {
    // 确保 children 只包含一个子节点
    return React.Children.only(this.props.children)
  }
}
