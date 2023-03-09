import React, { forwardRef } from 'react'
import { defaultFormContext } from './context'
import { mergeProps } from 'src/utils/with-default-props'

const classPrefix = `uabm-form`

export type FormInstance = Pick<RCFormInstance, 'getFieldValue'>

export type FormProps = Pick<RcFormProps, 'form'>

const defaultProps = defaultFormContext

export const Form = forwardRef<FormInstance, FormProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const { className } = props

  return <div>11</div>
})
