import React, { ComponentProps, FC, ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { traverseReactNode } from '../utils/traverse-react-node'
import { usePropsValue } from '../utils/use-props-value'
import Badge, { BadgeProps } from '../badge'
import { Corner } from './corner'

const classPrefix = `uabm-side-bar`

export type SideBarItemProps = {
  title?: ReactNode
  disabled?: boolean
  badge?: BadgeProps['content']
} & NativeProps

export const SideBarItem: FC<SideBarItemProps> = () => null

export type SideBarProps = {
  activeKey?: string | null
  defaultActiveKey?: string | null
  onChange?: (key: string) => void
  children?: ReactNode
} & NativeProps<'--width' | '--height' | '--item-border-radius' | '--backgrund-color'>

export const SideBar: FC<SideBarProps> = props => {
  let firstActiveKey: string | null = null

  const items: ReactElement<ComponentProps<typeof SideBarItem>>[] = []

  // 遍历出所有子节点选项
  traverseReactNode(props.children, (child, index) => {
    if (!React.isValidElement(child)) {
      return
    }
    const key = child.key
    if (typeof key !== 'string') {
      return
    }
    if (index === 0) {
      firstActiveKey = key
    }

    items.push(child)
  })

  const [activeKey, setActiveKey] = usePropsValue({
    value: props.activeKey,
    defaultValue: props.defaultActiveKey ?? firstActiveKey,
    onChange: v => {
      if (v === null) {
        return
      }
      props.onChange?.(v)
    },
  })

  // 当前活动选项是最后一个
  const lastItem = items[items.length - 1]
  const isLastItemActive = lastItem && lastItem.key === activeKey

  return withNativeProps(
    props,
    <div className={classPrefix}>
      <div className={`${classPrefix}-items`}>
        {items.map((item, index) => {
          const active = item.key === activeKey
          // 用于活动栏圆角
          const isActiveNextSibling = items[index - 1] && items[index - 1].key === activeKey
          const isActivePreviousSibling = items[index + 1] && items[index + 1].key === activeKey

          return withNativeProps(
            item.props,
            <div
              key={item.key}
              className={classNames(`${classPrefix}-item`, {
                [`${classPrefix}-item-active`]: active,
                [`${classPrefix}-item-disabled`]: item.props.disabled,
              })}
              onClick={() => {
                const { key } = item
                if (key === undefined || key === null || item.props.disabled) {
                  return
                }
                setActiveKey(key.toString())
              }}
            >
              {/* 活动选项上下两个圆倒角 */}
              <>
                {isActiveNextSibling && (
                  <Corner className={`${classPrefix}-item-corner ${classPrefix}-item-corner-top`} />
                )}
                {isActivePreviousSibling && (
                  <Corner
                    className={`${classPrefix}-item-corner ${classPrefix}-item-corner-bottom`}
                  />
                )}
              </>
              {/* 选项标题 */}
              <Badge content={item.props.badge} className={`${classPrefix}-badge`}>
                <div className={`${classPrefix}-item-title`}>
                  {active && <div className={`${classPrefix}-item-highlight`} />}
                  {item.props.title}
                </div>
              </Badge>
            </div>
          )
        })}
      </div>
      {isLastItemActive && (
        <div
          className={classNames(
            `${classPrefix}-extra-space`,
            `${classPrefix}-item-active-next-sibling`
          )}
        >
          <Corner className={`${classPrefix}-item-corner ${classPrefix}-item-corner-top`} />
        </div>
      )}
    </div>
  )
}
