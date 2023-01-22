import React from 'react'
import { isFragment } from 'react-is'

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
