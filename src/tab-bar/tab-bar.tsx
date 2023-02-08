import React, { FC, ReactNode, ReactElement, ComponentProps } from 'react'
import classNames from 'classnames'
import Badge, { BadgeProps } from '../badge'
import { traverseReactNode } from '../utils/traverse-react-node'
import { usePropsValue } from '../utils/use-props-value'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'
import SafeArea from '../safe-area'

const classPrefix = `uabm-tab-bar`

export type TabBarItemProps = {
  icon?: ReactNode | ((active: boolean) => ReactNode)
  title?: ReactNode | ((active: boolean) => ReactNode)
  badge?: BadgeProps['content']
} & NativeProps

export const TabBarItem: FC<TabBarItemProps> = () => null

export type TabBarProps = {
  activeKey?: string | null
  defaultActiveKey?: string | null
  onChange?: (key: string) => void
  safeArea?: boolean
  children?: ReactNode
} & NativeProps

const defalutProps = {
  safeArea: false,
}

export const TabBar: FC<TabBarProps> = p => {
  const props = mergeProps(defalutProps, p)

  let firstActiveKey: string | null = null

  const items: ReactElement<ComponentProps<typeof TabBarItem>>[] = []

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

  return withNativeProps(
    props,
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-wrap`}>
        {items.map(item => {
          const active = item.key === activeKey

          function renderContent() {
            const iconElement = item.props.icon && (
              <div className={`${classPrefix}-item-icon`}>
                {typeof item.props.icon === 'function' ? item.props.icon(active) : item.props.icon}
              </div>
            )

            const titleElement = item.props.title && (
              <div
                className={classNames(`${classPrefix}-item-title`, {
                  [`${classPrefix}-item-title-with-icon`]: Boolean(iconElement),
                })}
              >
                {typeof item.props.title === 'function'
                  ? item.props.title(active)
                  : item.props.title}
              </div>
            )

            if (iconElement) {
              return (
                <>
                  <Badge content={item.props.badge} className={`${classPrefix}-icon-badge`}>
                    {iconElement}
                  </Badge>
                  {titleElement}
                </>
              )
            } else if (titleElement) {
              return (
                <Badge content={item.props.badge} className={`${classPrefix}-title-badge`}>
                  {titleElement}
                </Badge>
              )
            }
            return null
          }

          return withNativeProps(
            item.props,
            <div
              key={item.key}
              onClick={() => {
                const { key } = item
                if (key === undefined || key === null) {
                  return
                }
                setActiveKey(key.toString())
              }}
              className={classNames(`${classPrefix}-item`, {
                [`${classPrefix}-item-active`]: active,
              })}
            >
              {renderContent()}
            </div>
          )
        })}
      </div>
      {props.safeArea && <SafeArea position='bottom' />}
    </div>
  )
}
