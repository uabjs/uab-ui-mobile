import React, { useRef } from 'react'
import classNames from 'classnames'
import { animated } from '@react-spring/web'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { traverseReactNode } from '../utils/traverse-react-node'
import { usePropsValue } from '../utils/use-props-value'
import { useTabListScroll } from '../utils/use-tab-list-scroll'

const classPrefix = `uabm-capsule-tabs`

export type CapsuleTabProps = {
  title: React.ReactNode
  disabled?: boolean
  forceRender?: boolean
  destroyOnClose?: boolean
  children?: React.ReactNode
} & NativeProps

export const CapsuleTab: React.FC<CapsuleTabProps> = () => {
  return null
}

export type CapsuleTabsProps = {
  activeKey?: string | null
  defaultActiveKey?: string | null
  onChange?: (key: string) => void
  children?: React.ReactNode
} & NativeProps

export const CapsuleTabs: React.FC<CapsuleTabsProps> = props => {
  const tabListContainerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const keyToIndexRecord: Record<string, number> = {}
  let firstActiveKey: string | null = null
  const panes: React.ReactElement<React.ComponentProps<typeof CapsuleTab>>[] = []

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
    const length = panes.push(child)
    keyToIndexRecord[key] = length - 1
  })

  const [activeKey, setActiveKey] = usePropsValue({
    value: props.activeKey,
    defaultValue: props.defaultActiveKey ?? firstActiveKey,
    onChange: v => {
      if (v === null) return
      props.onChange?.(v)
    },
  })

  const { scrollLeft, animate } = useTabListScroll(tabListContainerRef, keyToIndexRecord[activeKey as string])

  return withNativeProps(
    props,
    <div className={classPrefix} ref={rootRef}>
      <div className={`${classPrefix}-header`}>
        <animated.div className={`${classPrefix}-tab-list`} ref={tabListContainerRef}>
          {panes.map(pane =>
            withNativeProps(
              pane.props,
              <div key={pane.key} className={`${classPrefix}-tab-wrapper`}>
                <div
                  className={classNames(`${classPrefix}-tab`, {
                    [`${classPrefix}-tab-active`]: pane.key === activeKey,
                    [`${classPrefix}-tab-disabled`]: pane.props.disabled,
                  })}
                  onClick={() => {
                    const { key } = pane
                    if (pane.props.disabled) {
                      return
                    }
                    if (key === undefined || key === null) {
                      return
                    }
                    setActiveKey(key.toString())
                  }}
                >
                  {pane.props.title}
                </div>
              </div>
            )
          )}
        </animated.div>
      </div>
    </div>
  )
}
