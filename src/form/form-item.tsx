import React, { FC } from 'react'
import { Field } from 'rc-field-form'

export type FormItemProps = {}

export const FormItem: FC<FormItemProps> = props => {
  const { className } = props

  return <Field></Field>
}
