import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import getMiniDecimal, { toFixed, type DecimalClass } from '@rc-component/mini-decimal'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
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

type DEFAULT_PROPS = 'step'
type MergedStepperProps<ValueType> = Omit<BaseStepperProps<ValueType>, DEFAULT_PROPS> &
  Required<Pick<BaseStepperProps<ValueType>, DEFAULT_PROPS>> & {
    stringMode?: boolean
  }

const defaultProps = {
  step: 1,
  disabled: false,
  allowEmpty: false,
}

export function Stepper<ValueType extends number | string>(p: StepperProps) {
  const props = mergeProps(defaultProps, p)
  const {
    defaultValue = 0 as ValueType,
    value,
    onChange,
    disabled,
    step,
    max,
    min,
    inputReadOnly,
    digits,
    stringMode,
    formatter,
    parser,
  } = props as MergedStepperProps<ValueType>
  const { locale } = useConfig()

  // ========================== Parse / Format ==========================
  /** 格式化到小数点后固定位数 */
  const fixedValue = (value: ValueType): string => {
    const fixedValue = digits !== undefined ? toFixed(value.toString(), '.', digits) : value
    return fixedValue.toString()
  }

  /** 返回string或number （stringMode: 字符值模式，开启后支持高精度小数） */
  const getValueAsType = (value: DecimalClass) =>
    (stringMode ? value.toString() : value.toNumber()) as ValueType

  /** 格式化值  */
  const formatValue = (value: ValueType | null): string => {
    if (value === null) return ''
    // 格式化程序
    if (formatter) {
      return formatter(value)
    } else {
      return fixedValue(value)
    }
  }

  /** 用户自定义格式化了值需要通过用的编译器编译值 */
  const parseValue = (text: string): string | null => {
    if (text === '') return null
    if (parser) {
      return String(parser(text))
    }
    const decimal = getMiniDecimal(text)
    return decimal.isInvalidate() ? null : decimal.toString()
  }

  // ======================== Value & InputValue ========================
  const [mergedValue, setMergedValue] = useMergedState<ValueType | null>(defaultValue, {
    value,
    onChange: nextValue => {
      onChange?.(nextValue as ValueType)
    },
  })
  const [inputValue, setInputValue] = useState(() => formatValue(mergedValue))

  // 检查并设置值
  function setValueWithCheck(nextValue: DecimalClass) {
    if (nextValue.isNaN()) return
    let target = nextValue
    // 最小取值
    if (min !== undefined) {
      const minDecimal = getMiniDecimal(min)
      if (target.lessEquals(minDecimal)) {
        target = minDecimal
      }
    }

    // 最大取值
    if (max !== undefined) {
      const maxDecimal = getMiniDecimal(max)
      if (maxDecimal.lessEquals(target)) {
        target = maxDecimal
      }
    }

    // 固定小数位数
    if (digits !== undefined) {
      target = getMiniDecimal(fixedValue(getValueAsType(target)))
    }

    // 赋值
    setMergedValue(getValueAsType(target))
  }

  /** 输入值改变 */
  const handleInputChange = (v: string) => {
    setInputValue(v)
    const valueStr = parseValue(v)
    if (valueStr === null) {
      if (props.allowEmpty) {
        setMergedValue(null)
      } else {
        setMergedValue(defaultValue)
      }
    } else {
      setValueWithCheck(getMiniDecimal(valueStr))
    }
  }

  // ============================== Focus ===============================
  const [focused, setFocused] = useState(false)
  const inputRef = React.useRef<InputRef>(null)

  /** true时设置状态正在聚焦，比将值转换为原始文本，否则相反 */
  function triggerFocus(nextFocus: boolean) {
    setFocused(nextFocus)
    // 在聚焦时将值转换为原始文本
    if (nextFocus) {
      setInputValue(mergedValue !== null && mergedValue !== undefined ? String(mergedValue) : '')
    }
  }

  // 聚焦时执行 select 方法
  useEffect(() => {
    if (focused) {
      inputRef.current?.nativeElement?.select?.()
    }
  }, [focused])

  // mergedValue 改变时更新 InputValue
  useEffect(() => {
    if (!focused) {
      setInputValue(formatValue(mergedValue))
    }
  }, [focused, mergedValue, digits])

  // ============================ Operations ============================
  // 加减按钮操作
  const handleOffset = (positive: boolean) => {
    // 加减步长
    let stepValue = getMiniDecimal(step)
    if (!positive) {
      stepValue = stepValue.negate()
    }

    // stepValue 区分加减类型，stepValue.toString() = '1' | '-1'
    setValueWithCheck(getMiniDecimal(mergedValue ?? 0).add(stepValue.toString()))
  }
  const handleMinus = () => {
    handleOffset(false)
  }
  const handlePlus = () => {
    handleOffset(true)
  }
  const disabledMinus = () => {
    if (disabled) return true
    if (mergedValue === null) return false
    // 当前值 <= 最小值 时禁用
    if (min !== undefined) {
      return mergedValue <= min
    }
    return false
  }
  const disabledPlus = () => {
    if (disabled) return true
    if (mergedValue === null) return false
    // 当前值 >= 最大值 时禁用
    if (max !== undefined) {
      return mergedValue >= max
    }
    return false
  }

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
          onChange={val => {
            disabled || handleInputChange(val)
          }}
          disabled={disabled}
          readOnly={inputReadOnly}
          onFocus={e => {
            triggerFocus(true)
            props.onFocus?.(e)
          }}
          onBlur={e => {
            triggerFocus(false)
            props.onBlur?.(e)
          }}
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
