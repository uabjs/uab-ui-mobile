import classNames from 'classnames'
import React, { forwardRef, ReactElement, ReactNode, useState } from 'react'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { traverseReactNode } from '../utils/traverse-react-node'
import { mergeProps } from '../utils/with-default-props'
import { Panel } from './panel'
import { Sidebar } from './sidebar'

const classPrefix = `uabm-index-bar`

export type IndexBarProps = {
  sticky?: boolean
  onIndexChange?: (index: string) => void
  children?: React.ReactNode
} & NativeProps<'--sticky-offset-top'>

export type IndexBarRef = {
  scrollTo: (index: string) => void
}

const defaultProps = {
  sticky: true,
}

export const IndexBar = forwardRef<IndexBarRef, IndexBarProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  // const titleHeight = convertPx(35)

  const indexItems: {
    index: string
    brief: ReactNode
  }[] = []
  const panels: ReactElement[] = []

  traverseReactNode(props.children, child => {
    if (!React.isValidElement(child)) {
      return
    }

    // 只需要子节点是 IndexBar.Panel 的元素
    if (child.type !== Panel) {
      return
    }

    // 侧边栏字母数组
    indexItems.push({
      index: child.props.index,
      // 侧边栏取首字母
      brief: child.props.brief ?? child.props.index.charAt(0),
    })

    // 给 IndexBar.Panel 元素包装标题头部
    panels.push(
      withNativeProps(
        child.props,
        <div
          key={child.props.index}
          data-index={child.props.index}
          className={`${classPrefix}-anchor`}
        >
          <div className={`${classPrefix}-anchor-title`}>
            {child.props.title || child.props.index}
          </div>
          {child.props.children}
        </div>
      )
    )
  })

  // 标记当前活动下标 默认第一项
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstItem = indexItems[0]
    return firstItem ? firstItem.index : null
  })

  const scrollTo = (index: string) => {
    console.log('scrollTo=> ', index)
  }

  console.log('indexItems====', activeIndex, indexItems)

  return withNativeProps(
    props,
    <div
      className={classNames(`${classPrefix}`, {
        // 标题自动吸顶 class 样式
        [`${classPrefix}-sticky`]: props.sticky,
      })}
    >
      {/* 侧边栏 */}
      <Sidebar
        indexItems={indexItems}
        activeIndex={activeIndex}
        onActive={index => {
          scrollTo(index)
        }}
      />
    </div>
  )
})
