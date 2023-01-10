import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react'
import { isPromise } from '../../utils/validate'
import { mergeProps } from '../../utils/with-default-props'
import { NativeProps, withNativeProps } from '../../utils/native-props'

const classPrefix = `uabm-button`

export type ButtonProps = {
  block?: boolean
  fill?: 'solid' | 'outline' | 'none'
  type?: 'submit' | 'reset' | 'button'
  size?: 'mini' | 'small' | 'middle' | 'large'
  shape?: 'default' | 'rounded' | 'rectangular'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger',
  loading?: boolean | 'auto'
  loadingText?: string
  loadingIcon?: React.ReactNode,
  disabled?: boolean
  children?: React.ReactNode,
  onClick?: (event: React.MouseEvent<HTMLButtonElement | MouseEvent>) => void | Promise<void> | unknown
} &
  NativeProps<
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
  const loading = p.loading === 'auto' ? innerLoading : p.loading
  const disabled = p.disabled || loading

  // useImperativeHandle 和 forwardRef 同时使用，用于减少暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    get nativeElement() {
      return nativeElementRef.current
    }
  }))

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async e => {
    if (!p.onClick) return

    const promise = p.onClick(e)

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
      type={p.type}
      disabled={disabled}
      onClick={handleClick}

    >
      {
        loading ? (
          <div className={`${classPrefix}-loading-wrapper`}>
            {props.loadingIcon}
            {props.loadingText}
          </div>
        ) : (
          <span>{props.children}</span>
        )
      }
    </button>
    )
})
