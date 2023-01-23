import React from 'react'
import { isFragment } from 'react-is'

/** 浅遍历所有子节点，回调参数二传入节点与下标 （提示：遇到<>标签时继续浅遍历该标签所有子节点） */
export function traverseReactNode(children: React.ReactNode, fn: (child: React.ReactNode, index: number) => void) {
  let i = 0
  function handle(target: React.ReactNode) {
    React.Children.forEach(target, child => {
      if (!isFragment(child)) {
        fn(child, i)
        i += 1
      } else {
        handle(child.props.children)
      }
    })
  }
  handle(children)
}
