import classNames from 'classnames'
import React, { ReactNode, useState } from 'react'

const classPrefix = `uabm-index-bar`

type SidebarProps = {
  indexItems: {
    index: string
    brief: ReactNode
  }[]
  activeIndex: string | null
  onActive: (index: string) => void
}

export const Sidebar: React.FC<SidebarProps> = props => {
  // interacting 按下中
  const [interacting, setInteracting] = useState(false)

  return (
    <div
      className={classNames(`${classPrefix}-sidebar`, {
        [`${classPrefix}-sidebar-interacting`]: interacting,
      })}
      // 按下鼠标
      onMouseDown={() => {
        setInteracting(true)
      }}
      // 松开鼠标
      onMouseUp={() => {
        setInteracting(false)
      }}
      // 开始触摸
      onTouchStart={() => {
        setInteracting(true)
      }}
      // 触摸移动
      onTouchMove={e => {
        if (!interacting) return
        const { clientX, clientY } = e.touches[0]
        const target = document.elementFromPoint(clientX, clientY) as HTMLElement
        if (!target) {
          return
        }
        // 获取当前触摸元素的 data-index 属性值
        const index = target.dataset['index']
        if (index) {
          props.onActive(index)
        }
      }}
      // 结束触摸
      onTouchEnd={() => {
        setInteracting(false)
      }}
    >
      {props.indexItems.map(({ index, brief }) => {
        const active = index === props.activeIndex
        return (
          <div
            className={`${classPrefix}-sidebar-row`}
            // 按下鼠标
            onMouseDown={() => {
              props.onActive(index)
            }}
            // 开始触摸
            onTouchStart={() => {
              props.onActive(index)
            }}
            // 鼠标移动
            onMouseEnter={() => {
              if (interacting) {
                props.onActive(index)
              }
            }}
            data-index={index}
            key={index}
          >
            {interacting && active && (
              <div className={`${classPrefix}-sidebar-bubble`}>{brief}</div>
            )}
            <div
              className={classNames(`${classPrefix}-sidebar-item`, {
                [`${classPrefix}-sidebar-item-active`]: active,
              })}
              data-index={index}
            >
              <div>{brief}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
