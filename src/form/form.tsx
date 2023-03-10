import React, { forwardRef, ForwardedRef } from 'react'
import RcForm from 'rc-field-form'
import type { FormProps as RcFormProps, FormInstance as RCFormInstance } from 'rc-field-form'
import { defaultFormContext } from './context'
import { mergeProps } from '../utils/with-default-props'

const classPrefix = `uabm-form`

export type FormInstance = Pick<RCFormInstance, 'getFieldValue'>

export type FormProps = Pick<RcFormProps, 'form'>

const defaultProps = defaultFormContext

export const Form = forwardRef<FormInstance, FormProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const { className, footer } = props

  return (
    <RcForm ref={ref as ForwardedRef<RCFormInstance>}>
      {footer && <div className={`${classPrefix}-footer`}>{footer}</div>}
    </RcForm>
  )
})
