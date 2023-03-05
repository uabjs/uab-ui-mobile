import React, { ReactNode, FC, useMemo } from 'react'
import { GetContainer } from '../utils/render-to-container'
import { PropagationEvent } from '../utils/with-stop-propagation'
import { mergeProps } from '../utils/with-default-props'

import Mask, { MaskProps } from '../mask'
import classNames from 'classnames'
import AutoCenter from '../auto-center'
import { CheckOutline, CloseOutline } from 'antd-mobile-icons'
import SpinLoading from '../spin-loading'

const classPrefix = `uabm-toast`

export interface ToastProps {
  afterClose?: () => void
  maskStyle?: MaskProps['style']
  maskClassName?: string
  maskClickable?: boolean
  content?: ReactNode
  icon?: 'success' | 'fail' | 'loading' | ReactNode
  duration?: number
  position?: 'top' | 'bottom' | 'center'
  visible?: boolean
  getContainer?: GetContainer
  stopPropagetion?: PropagationEvent[]
}

const defaultProps = {
  maskClickable: true,
  stopPropagetion: ['click'],
}

export const InternalToast: FC<ToastProps> = p => {
  const props = mergeProps(defaultProps, p)
  const {
    afterClose,
    maskStyle,
    maskClickable,
    content,
    icon,
    position,
    getContainer,
    stopPropagetion,
  } = props

  const iconElement = useMemo(() => {
    if (icon === null || icon === undefined) return null
    switch (icon) {
      case 'success':
        return <CheckOutline className={`${classPrefix}-icon-success`} />
      case 'fail':
        return <CloseOutline className={`${classPrefix}-icon-fail`} />
      case 'loading':
        return <SpinLoading color='white' className={`${classPrefix}-loading`} />
      default:
        return icon
    }
  }, [icon])

  const top = useMemo(() => {
    switch (position) {
      case 'top':
        return '20%'
      case 'bottom':
        return '80%'
      default:
        return '50%'
    }
  }, [position])

  return (
    <Mask
      visible={props.visible}
      destroyOnClose
      opacity={0}
      disableBodyScroll={!maskClickable}
      getContainer={getContainer}
      afterClose={afterClose}
      style={{
        pointerEvents: maskClickable ? 'none' : 'auto',
        ...maskStyle,
      }}
      className={classNames(`${classPrefix}-mask`, props.maskClassName)}
      stopPropagation={stopPropagetion}
    >
      <div className={classNames(`${classPrefix}-wrap`)}>
        <div
          style={{ top }}
          className={classNames(
            `${classPrefix}-main`,
            icon ? `${classPrefix}-main-icon` : `${classPrefix}-main-text`
          )}
        >
          {iconElement && <div className={`${classPrefix}-icon`}>{iconElement}</div>}
          <AutoCenter>{content}</AutoCenter>
        </div>
      </div>
    </Mask>
  )
}
