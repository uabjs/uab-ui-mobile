import React, { ComponentProps, FC, ReactElement, ReactNode, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useMount } from 'ahooks'
import { useIsomorphicUpdateLayoutEffect } from '../utils/use-isomorphic-update-layout-effect'
import { traverseReactNode } from '../utils/traverse-react-node'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { usePropsValue } from '../utils/use-props-value'
import { useShouldRender } from '../utils/should-render'
import List from '../list'
import { DownOutline } from 'antd-mobile-icons'
import classNames from 'classnames'

const classPrefix = `uabm-collapse`

export type CollapsePanelProps = {
  key: string
  title: ReactNode
  disabled?: boolean
  forceRender?: boolean
  destroyOnClose?: boolean
  arrow?: ReactNode | ((active: boolean) => ReactNode)
  onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void
  children?: ReactNode
} & NativeProps

export const CollapsePanel: FC<CollapsePanelProps> = () => null

const CollapsePanelContent: FC<{
  visible: boolean
  forceRender: boolean
  destroyOnClose: boolean
  children?: ReactNode
}> = props => {
  const { visible } = props
  const shouldRender = useShouldRender(visible, props.forceRender, props.destroyOnClose)
  const innerRef = useRef<HTMLDivElement>(null)

  const [{ height }, api] = useSpring(() => ({
    from: { height: 0 }, // 起始高度
    config: {
      precision: 0.01,
      mass: 1,
      tension: 200,
      friction: 25,
      clamp: true,
    },
  }))

  // 初始显示初始高度
  useMount(() => {
    if (!visible) return
    const inner = innerRef.current
    if (!inner) return
    api.start({
      height: inner.offsetHeight,
      immediate: true,
    })
  })

  // 显示改变时动画
  useIsomorphicUpdateLayoutEffect(() => {
    const inner = innerRef.current
    if (!inner) return
    if (visible) {
      console.log('11111-2--3')
      api.start({
        height: inner.offsetHeight,
      })
    } else {
      api.start({
        height: inner.offsetHeight,
        immediate: true,
      })
      api.start({
        height: 0,
      })
    }
  }, [visible])

  return (
    <animated.div
      className={`${classPrefix}-panel-content`}
      style={{
        height: height.to(v => {
          // 动画停止时将 height 值设置为 'auto'
          if (height.idle && visible) {
            return 'auto'
          } else {
            return v
          }
        }),
      }}
    >
      <div className={`${classPrefix}-panel-content-inner`} ref={innerRef}>
        <List.Item>{shouldRender && props.children}</List.Item>
      </div>
    </animated.div>
  )
}

type ValueProps<T> = {
  activeKey?: T
  defaultActiveKey?: T
  onChange?: (activeKey: T) => void
  arrow?: ReactNode | ((active: boolean) => ReactNode)
}

export type CollapseProps = (
  | ({
      accordion?: false
    } & ValueProps<string[]>)
  | ({
      accordion: true
    } & ValueProps<string | null>)
) & {
  children?: ReactNode
} & NativeProps

export const Collapse: FC<CollapseProps> = props => {
  const panels: ReactElement<ComponentProps<typeof CollapsePanel>>[] = []
  traverseReactNode(props.children, child => {
    if (!React.isValidElement(child)) return
    if (typeof child.key !== 'string') return
    panels.push(child)
  })

  const [activeKey, setActiveKey] = usePropsValue<string[]>(
    props.accordion
      ? {
          value:
            props.activeKey === undefined
              ? undefined
              : props.activeKey === null
              ? []
              : [props.activeKey],
          defaultValue:
            props.defaultActiveKey === undefined || props.defaultActiveKey === null
              ? []
              : [props.defaultActiveKey],
          onChange: v => {
            props.onChange?.(v[0] ?? null)
          },
        }
      : {
          value: props.activeKey,
          defaultValue: props.defaultActiveKey ?? [],
          onChange: props.onChange,
        }
  )

  const activeKeyList = activeKey === null ? [] : Array.isArray(activeKey) ? activeKey : [activeKey]

  return withNativeProps(
    props,
    <div className={classPrefix}>
      <List>
        {panels.map(panel => {
          const key = panel.key as string
          const active = activeKeyList.includes(key)
          const handleClick = (event: React.MouseEvent<Element, MouseEvent>) => {
            if (props.accordion) {
              if (active) {
                setActiveKey([])
              } else {
                setActiveKey([key])
              }
            } else {
              if (active) {
                setActiveKey(activeKeyList.filter(v => v !== key))
              } else {
                setActiveKey([...activeKeyList, key])
              }
            }

            panel.props.onClick?.(event)
          }

          const renderArrow = () => {
            let arrow: CollapseProps['arrow'] = <DownOutline />
            if (props.arrow !== undefined) {
              arrow = props.arrow
            }
            if (panel.props.arrow !== undefined) {
              arrow = panel.props.arrow
            }
            return typeof arrow === 'function' ? (
              arrow(active)
            ) : (
              <div
                className={classNames(`${classPrefix}-arrow`, {
                  [`${classPrefix}-arrow-active`]: active,
                })}
              >
                {arrow}
              </div>
            )
          }

          return (
            <React.Fragment key={key}>
              {withNativeProps(
                panel.props,
                <List.Item
                  className={`${classPrefix}-panel-header`}
                  onClick={handleClick}
                  disabled={panel.props.disabled}
                  arrow={renderArrow()}
                >
                  {panel.props.title}
                </List.Item>
              )}
              <CollapsePanelContent
                visible={active}
                forceRender={!!panel.props.forceRender}
                destroyOnClose={!!panel.props.destroyOnClose}
              >
                {panel.props.children}
              </CollapsePanelContent>
            </React.Fragment>
          )
        })}
      </List>
    </div>
  )
}
