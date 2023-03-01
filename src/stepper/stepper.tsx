import React, { useState } from 'react'
import classNames from 'classnames'
import getMiniDecimal, { toFixed, type DecimalClass } from '@rc-component/mini-decimal'
import { MinusOutline, AddOutline } from 'antd-mobile-icons'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { mergeProps } from '../utils/with-default-props'
import Button from '../button'
import { useConfig } from '../config-provider'
import Input, { InputProps, InputRef } from '../input'

const classPrefix = `uabm-stepper`

type ValueProps<ValueType> = {
  allowEmpty: true
  value?: ValueType | null
  defaultValue?: ValueType | null
  onChange?: (value: ValueType | null) => void
}

type ValuePropsWithNull<ValueType> = {
  allowEmpty?: false
  value?: ValueType
  defaultValue?: ValueType
  onChange?: (value: ValueType) => void
}

export type BaseStepperProps<ValueType> = Pick<InputProps, 'onFocus' | 'onBlur'> &
  (ValuePropsWithNull<ValueType> | ValueProps<ValueType>) & {
    min?: ValueType
    max?: ValueType
    step?: ValueType
    digits?: number
    disabled?: boolean
    inputReadOnly?: boolean
    // Format & Parse
    parser?: (text: string) => ValueType
    formatter?: (value?: ValueType) => string
  } & NativeProps<
    | '--height'
    | '--input-width'
    | '--input-font-size'
    | '--input-background-color'
    | '--border-radius'
    | '--border'
    | '--border-inner'
    | '--active-border'
    | '--button-font-size'
    | '--button-background-color'
    | '--button-width'
    | '--input-font-color'
    | '--button-text-color'
  >

// 字符串模式
export type NumberStepperProps = BaseStepperProps<number> & {
  stringMode?: false
}
export type StringStepperProps = BaseStepperProps<string> & {
  stringMode: true
}
export type StepperProps = NumberStepperProps | StringStepperProps

const defaultProps = {
  step: 1,
  disabled: false,
  allowEmpty: false,
}

export function Stepper<ValueProps extends number | string>(p: StepperProps) {
  const props = mergeProps(defaultProps, p)
  const { defaultValue = 0 as ValueType, value, onChange, disabled, step, max, min } = props
  const { locale } = useConfig()

  const [inputValue, setInputValue] = useState()
  // ============================== Focus ===============================
  const [focused, setFocused] = useState(false)
  const inputRef = React.useRef<InputRef>(null)

  // ============================ Operations ============================
  const handleOffset = (positive: boolean) => {
    let stepValue = getMiniDecimal(step)
    if (!positive) {
      stepValue = stepValue.negate()
    }
  }
  const handleMinus = () => {
    handleOffset(false)
  }
  const handlePlus = () => {
    handleOffset(true)
  }
  const disabledMinus = () => {}
  const disabledPlus = () => {}

  return withNativeProps(
    props,
    <div
      className={classNames(classPrefix, {
        [`${classPrefix}-active`]: focused,
      })}
    >
      <Button
        className={`${classPrefix}-minus`}
        onClick={handleMinus}
        disabled={disabledMinus()}
        fill='none'
        shape='rectangular'
        color='primary'
        aria-label={locale.Stepper.decrease}
      >
        <MinusOutline />
      </Button>
      <div className={`${classPrefix}-middle`}>
        <Input
          ref={inputRef}
          className={`${classPrefix}-input`}
          value={inputValue}
          disabled={disabled}
          // 无障碍：https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA
          // 用于使残障人士更容易访问
          role='spinbutton' // 告诉残障人士s此处是一个spin按钮
          aria-valuenow={Number(inputValue)}
          aria-valuemax={Number(max)}
          aria-valuemin={Number(min)}
          // 输入小数模式
          inputMode='decimal'
        />
      </div>
      <Button
        className={`${classPrefix}-minus`}
        onClick={handlePlus}
        disabled={disabledPlus()}
        fill='none'
        shape='rectangular'
        color='primary'
        aria-label={locale.Stepper.increase}
      >
        <AddOutline />
      </Button>
    </div>
  )
}
