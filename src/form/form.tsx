import React from 'react'

import { mergeProps } from 'src/utils/with-default-props'

const classPrefix = `uabm-form`

export type FormInstance = Pick<RCFormInstance, 'getFieldValue'>

export type FormProps = Pick<RcFormProps, 'form'>

export const Form = forwardRef<FormInstance, FormProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const { className } = props

  return <div>11</div>
})
