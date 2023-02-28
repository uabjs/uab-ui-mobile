import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { usePropsValue } from '../utils/use-props-value'
import Grid, { GridProps } from '../grid'
import Space from '../space'
import { CheckMark } from './check-mark'

const classPrefix = `uabm-selector`

type SelectorValue = string | number

export interface SelectorOption<V> {
  label: ReactNode
  description?: ReactNode
  value: V
  disabled?: boolean
}

export type SelectorProps<V> = {
  options: SelectorOption<V>[]
  columns?: GridProps['columns']
  multiple?: boolean
  disabled?: boolean
  defaultValue?: V[]
  value?: V[]
  onChange?: (v: V[], extend: { items: SelectorOption<V>[] }) => void
  showCheckMark?: boolean
} & NativeProps<
  | '--color'
  | '--checked-color'
  | '--text-color'
  | '--checked-text-color'
  | '--border'
  | '--checked-border'
  | '--border-radius'
  | '--padding'
  | '--gap'
  | '--gap-vertical'
  | '--gap-horizontal'
>

const defaultProps = {
  multiple: false,
  defaultValue: [],
  showCheckMark: true,
}

export const Selector = <V extends SelectorValue>(p: SelectorProps<V>) => {
  const props = mergeProps(defaultProps, p)
  const [value, setValue] = usePropsValue({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: val => {
      const extend = {
        // 返回选项原数据
        get items() {
          return props.options.filter(option => val.includes(option.value))
        },
      }
      props.onChange?.(val, extend)
    },
  })

  const items = props.options.map(option => {
    const active = (value || []).includes(option.value)
    const disabled = option.disabled || props.disabled
    return (
      <div
        key={option.value}
        className={classNames(`${classPrefix}-item`, {
          [`${classPrefix}-item-active`]: active && !props.multiple,
          [`${classPrefix}-item-multiple-active`]: active && props.multiple,
          [`${classPrefix}-item-disabled`]: disabled,
        })}
        onClick={() => {
          if (disabled) return
          if (props.multiple) {
            const val = active ? value.filter(v => v !== option.value) : [...value, option.value]
            setValue(val)
          } else {
            const val = active ? [] : [option.value]
            setValue(val)
          }
        }}
      >
        {option.label}
        {option.description && (
          <div className={`${classPrefix}-item-description`}>{option.description}</div>
        )}
        {active && props.showCheckMark && (
          <div className={`${classPrefix}-check-mark-wrapper`}>
            <CheckMark />
          </div>
        )}
      </div>
    )
  })

  return withNativeProps(
    props,
    <div className={classPrefix}>
      {props.columns ? <Grid columns={props.columns}>{items}</Grid> : <Space wrap>{items}</Space>}
    </div>
  )
}
