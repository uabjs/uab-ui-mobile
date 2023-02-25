import React, { FC, ReactNode } from 'react'
import classNames from 'classnames'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { classPrefix as stepClassPrefix, StepProps } from './step'

const classPrefix = `uabm-steps`

const defaultIcon = <span className={`${stepClassPrefix}-icon-dot`} />

type Direction = 'horizontal' | 'vertical'

export type StepsProps = {
  current?: number
  direction?: Direction
  children?: ReactNode
} & NativeProps<
  '--title-font-size' | '--description-font-size' | '--indicator-margin-right' | '--icon-size'
>

const defaultProps = {
  current: 0,
  direction: 'horizontal',
}

export const Steps: FC<StepsProps> = p => {
  const props = mergeProps(defaultProps, p)
  const { current, direction } = props

  return withNativeProps(
    props,
    <div className={classNames(classPrefix, `${classPrefix}-${direction}`)}>
      {React.Children.map(props.children, (child, index) => {
        if (!React.isValidElement(child)) {
          return child
        }

        const props = child.props as StepProps
        let status = props.status || 'wait'

        if (index < current) {
          status = props.status || 'finish'
        } else if (index === current) {
          status = props.status || 'process'
        }

        const icon = props.icon ?? defaultIcon

        return React.cloneElement(child, {
          status,
          icon,
        })
      })}
    </div>
  )
}
