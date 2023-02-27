import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import classNames from 'classnames'
import { CloseCircleFill } from 'antd-mobile-icons'
import { usePropsValue } from '../utils/use-props-value'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { bound } from '../utils/bound'
import { isIOS } from '../utils/validate'
import { useConfig } from '../config-provider'
import { useIsomorphicLayoutEffect } from 'ahooks'

const classPrefix = `uabm-input`

type NativeInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

// 这些道具目前只在内部使用。它们不会导出给用户：
type AriaProps = {
  role?: string
}

export type InputProps = Pick<
  NativeInputProps,
  | 'maxLength'
  | 'minLength'
  | 'autoComplete'
  | 'autoFocus'
  | 'pattern'
  | 'inputMode'
  | 'type'
  | 'name'
  | 'onFocus'
  | 'onBlur'
  | 'autoCapitalize'
  | 'autoCorrect'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onCompositionStart'
  | 'onCompositionEnd'
  | 'onClick'
  | 'step'
> & {
  value?: string
  defaultValue?: string
  onChange?: (val: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  clearable?: boolean
  onlyShowClearWhenFocus?: boolean
  onClear?: () => void
  id?: string
  onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  min?: number
  max?: number
} & NativeProps<'--font-size' | '--color' | '--placeholder-color' | '--text-align'> &
  AriaProps

export type InputRef = {
  clear: () => void
  focus: () => void
  blur: () => void
  nativeElement: HTMLInputElement | null
}

const defaultValue = {
  defaultValue: '',
  onlyShowClearWhenFocus: true,
}

export const Input = forwardRef<InputRef, InputProps>((p, ref) => {
  const props = mergeProps(defaultValue, p)
  const [value, setValue] = usePropsValue(props)
  const [hasFocus, setHasFocus] = useState(false)
  const nativeInputRef = useRef<HTMLInputElement>(null)
  const compositionStartRef = useRef(false)
  const { locale } = useConfig()

  useImperativeHandle(ref, () => ({
    clear: () => {
      setValue('')
    },
    focus: () => {
      nativeInputRef.current?.focus()
    },
    blur: () => {
      nativeInputRef.current?.blur()
    },
    get nativeElement() {
      return nativeInputRef.current
    },
  }))

  // 渲染页面前执行，防止闪屏
  useIsomorphicLayoutEffect(() => {
    if (!props.enterKeyHint) return
  }, [props.enterKeyHint])

  function checkValue() {
    let nextValue = value
    if (props.type === 'number') {
      nextValue = nextValue && bound(parseFloat(nextValue), props.min, props.max).toString()
    }
    if (nextValue !== value) {
      setValue(nextValue)
    }
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.onEnterPress && (e.code === 'Enter' || e.keyCode === 13)) {
      props.onEnterPress(e)
    }
    props.onKeyDown?.(e)
  }

  const shouldShowClear = (() => {
    if (!props.clearable || !value || props.readOnly) return false
    // 仅在聚焦时显示清除按钮
    if (props.onlyShowClearWhenFocus) {
      return hasFocus
    } else {
      return true
    }
  })()

  return withNativeProps(
    props,
    <div className={classNames(`${classPrefix}`, props.disabled && `${classPrefix}-disabled`)}>
      <input
        ref={nativeInputRef}
        className={`${classPrefix}-element`}
        value={value}
        onChange={e => {
          setValue(e.target.value)
        }}
        onFocus={e => {
          setHasFocus(true)
          props.onFocus?.(e)
        }}
        onBlur={e => {
          setHasFocus(true)
          checkValue()
          props.onBlur?.(e)
        }}
        // 属性参考：https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input
        id={props.id}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        maxLength={props.maxLength}
        minLength={props.minLength}
        max={props.max}
        min={props.min}
        autoComplete={props.autoComplete}
        autoFocus={props.autoFocus}
        pattern={props.pattern}
        inputMode={props.inputMode}
        type={props.type}
        name={props.name}
        autoCapitalize={props.autoCapitalize}
        autoCorrect={props.autoCorrect}
        onKeyDown={handleKeydown}
        onKeyUp={props.onKeyUp}
        // onCompositionStart：是指中文输入法开始输入触发，每次输入开始仅执行一次，执行的开始是 end 事件结束了才会触发
        onCompositionStart={e => {
          compositionStartRef.current = true
          props.onCompositionStart?.(e)
        }}
        // onCompositionEnd：是指中文输入法输入完成时触发，这是得到的结果就是最终输入完成的结果，此事件仅执行一次。
        onCompositionEnd={e => {
          compositionStartRef.current = false
          props.onCompositionEnd?.(e)
        }}
        onClick={props.onClick}
        step={props.step}
        role={props.role}
        aria-valuenow={props['aria-valuenow']}
        aria-valuemax={props['aria-valuemax']}
        aria-valuemin={props['aria-valuemin']}
        aria-label={props['aria-label']}
      />
      {shouldShowClear && (
        <div
          className={`${classPrefix}-clear`}
          onMouseDown={e => {
            e.preventDefault()
          }}
          onClick={() => {
            setValue('')
            props.onClear?.()

            // https://github.com/ant-design/ant-design-mobile/issues/5212
            // ios输入中文时点击清除按钮，主动让input失焦
            if (isIOS() && compositionStartRef.current) {
              compositionStartRef.current = false
              nativeInputRef.current?.blur()
            }
          }}
          aria-label={locale.Input.clear}
        >
          <CloseCircleFill />
        </div>
      )}
    </div>
  )
})
