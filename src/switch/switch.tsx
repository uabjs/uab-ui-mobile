import React, { FC, ReactNode, useState } from 'react'
import classNames from 'classnames'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { mergeProps } from '../utils/with-default-props'
import { usePropsValue } from '../utils/use-props-value'
import { isPromise } from '../utils/validate'
import { useConfig } from '../config-provider'
import { SpinIcon } from './spin-icon'

const classPrefix = `uabm-switch`

export type SwitchProps = {
  loading?: boolean
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void | Promise<void>
  checkedText?: ReactNode
  uncheckedText?: ReactNode
} & NativeProps<'--checked-color' | '--width' | '--height' | '--border-width'>

const defaultProps = {
  defaultChecked: false,
}

export const Switch: FC<SwitchProps> = p => {
  const props = mergeProps(defaultProps, p)
  const disabled = props.disabled || props.loading || false
  // changing：当前切换中
  const [changing, setChanging] = useState(false)
  const { locale } = useConfig()

  const [checked, setChecked] = usePropsValue({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange,
  })

  async function onClick() {
    if (disabled || props.loading || changing) return
    const result = setChecked(!checked)
    if (isPromise(result)) {
      setChanging(true)
      try {
        await result
        setChanging(false)
      } catch (e) {
        setChanging(false)
        throw e
      }
    }
  }

  return withNativeProps(
    props,
    <div
      onClick={onClick}
      className={classNames(classPrefix, {
        [`${classPrefix}-checked`]: checked,
        [`${classPrefix}-disabled`]: disabled || changing,
      })}
      role='switch'
      aria-label={locale.Switch.name}
      aria-checked={checked}
      aria-disabled={disabled}
    >
      <div className={`${classPrefix}-checkbox`}>
        <div className={`${classPrefix}-handle`}>
          {(props.loading || changing) && <SpinIcon className={`${classPrefix}-spin-icon`} />}
        </div>
        <div className={`${classPrefix}-inner`}>
          {checked ? props.checkedText : props.uncheckedText}
        </div>
      </div>
    </div>
  )
}
