import React, { useRef } from 'react'

import classNames from 'classnames'
import { NativeProps, withNativeProps } from '../utils/native-props'

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

  const panes: React.ReactElement<React.ComponentProps<typeof CapsuleTab>>[] = []

  return withNativeProps(
    props,
    <div className={classPrefix} ref={rootRef}>
      <div className={`${classPrefix}-header`}>
        <div className={`${classPrefix}-tab-list`} ref={tabListContainerRef}>
          {panes.map(pane => {
            withNativeProps(
              pane.props,
              <div key={pane.key} className={`${classPrefix}-tab-wrapper`}>
                <div
                  className={classNames(`${classPrefix}-tab`, {
                    [`${classPrefix}-tab-active`]: pane.key === activeKey,
                    [`${classPrefix}-tab-disabled`]: pane.props.disabled,
                  })}
                >
                  {pane.props.title}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
