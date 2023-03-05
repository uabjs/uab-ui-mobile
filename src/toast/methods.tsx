import React from 'react'
import { ImperativeHandler, renderImperatively } from '../utils/render-imperatively'
import { mergeProps } from '../utils/with-default-props'
import { ToastProps, InternalToast } from './toast'

export type ToastShowProps = Omit<ToastProps, 'visible'>

export type ToastHandler = ImperativeHandler

const ToastInner = (
  props: ToastShowProps & {
    onClose?: () => void
  }
) => <InternalToast {...props} />

let currentHandler: ToastHandler | null = null
let currentTimeout: number | null = null

const defaultProps = {
  duration: 2000,
  position: 'center',
  maskClickable: true,
}

export function show(p: ToastShowProps | string) {
  const props = mergeProps(defaultProps, typeof p === 'string' ? { content: p } : p)

  const element = (
    <ToastInner
      {...props}
      onClose={() => {
        currentHandler = null
      }}
    />
  )

  // Toast 第二次渲染时发现渲染过直接替换元素即可
  if (currentHandler) {
    currentHandler.replace(element)
  } else {
    // 默认 currentHandler = null 强制渲染，返回 { close: 关闭fn, replace: 替换fn }
    currentHandler = renderImperatively(element)
  }

  // 存在关闭定时器时销毁它
  if (currentTimeout) {
    window.clearTimeout(currentTimeout)
  }

  // 存在 Toast 持续时间，开启定时器销毁它
  if (props.duration) {
    currentTimeout = window.setTimeout(() => {
      clear()
    }, props.duration)
  }

  return currentHandler as ToastHandler
}

/** 关闭所有显示中的 Toast */
export function clear() {
  currentHandler?.close()
  currentHandler = null
}

/** Toast 全局配置 */
export function config(val: Pick<ToastProps, 'duration' | 'position' | 'maskClickable'>) {
  if (val.duration !== undefined) {
    defaultProps.duration = val.duration
  }
  if (val.position !== undefined) {
    defaultProps.position = val.position
  }
  if (val.maskClickable !== undefined) {
    defaultProps.maskClickable = val.maskClickable
  }
}
