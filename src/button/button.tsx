import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react'
import classNames from 'classnames'
import { isPromise } from '../utils/validate'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'

const classPrefix = `uabm-button`

export type ButtonProps = {
  block?: boolean
  fill?: 'solid' | 'outline' | 'none'
  type?: 'submit' | 'reset' | 'button'
  size?: 'mini' | 'small' | 'middle' | 'large'
  shape?: 'default' | 'rounded' | 'rectangular'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  loading?: boolean | 'auto'
  loadingText?: string
  loadingIcon?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => void | Promise<void> | unknown
} & NativeProps<
  | '--text-color'
  | '--background-color'
  | '--border-radius'
  | '--border-width'
  | '--border-style'
  | '--border-color'
>

export type ButtonRef = {
  nativeElement: HTMLButtonElement | null
}

const defaultProps: ButtonProps = {
  block: false,
  fill: 'solid',
  type: 'button',
  size: 'middle',
  shape: 'default',
  color: 'default',
  loading: false,
  loadingIcon: <div>...</div>,
}

export const Button = forwardRef<ButtonRef, ButtonProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const [innerLoading, setInnerLoading] = useState(false)
  const nativeElementRef = useRef<HTMLButtonElement>(null)
  const loading = props.loading === 'auto' ? innerLoading : props.loading
  const disabled = props.disabled || loading

  // useImperativeHandle 和 forwardRef 同时使用，用于减少暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    get nativeElement() {
      return nativeElementRef.current
    },
  }))

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async e => {
    if (!props.onClick) return

    const promise = props.onClick(e)

    if (isPromise(promise)) {
      try {
        setInnerLoading(true)
        await promise
        setInnerLoading(false)
      } catch (e) {
        setInnerLoading(false)
        throw e
      }
    }
  }

  return withNativeProps(
    props,
    <button
      ref={nativeElementRef}
      type={props.type}
      disabled={disabled}
      className={classNames(classPrefix, {
        [`${classPrefix}-${props.color}`]: !!props.color,
        [`${classPrefix}-block`]: props.block,
        [`${classPrefix}-disabled`]: disabled,
        [`${classPrefix}-loading`]: loading,
        [`${classPrefix}-${props.size}`]: !!props.size,
        [`${classPrefix}-fill-${props.fill}`]: !!props.fill,
      })}
      onClick={handleClick}
    >
      {loading ? (
        <div className={`${classPrefix}-loading-wrapper`}>
          {props.loadingIcon}
          {props.loadingText}
        </div>
      ) : (
        <span>{props.children}</span>
      )}
    </button>
  )
})
