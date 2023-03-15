import React, { FC, ReactNode } from 'react'
import { Field, FormInstance } from 'rc-field-form'
import type { FieldProps } from 'rc-field-form/es/Field'
import List, { ListItemProps } from '../list'
import { withNativeProps } from 'src/utils/native-props'

type RenderChildren<Values = any> = (form: FormInstance<Values>) => React.ReactNode

type ChildrenType<Values = any> = RenderChildren<Values> | React.ReactNode

type RcFieldProps = Omit<FieldProps, 'children'>

export type FormItemProps = Pick<RcFieldProps, 'dependencies' | 'name'> &
  Pick<ListItemProps, 'style' | 'extra'> & {
    required?: boolean
    children?: ChildrenType
  }

export const FormItem: FC<FormItemProps> = props => {
  const { className, name, required, ...fieldProps } = props

  function renderLayout(
    baseChildren: ReactNode,
    fieldId?: string,
    meta?: Meta,
    isRequired?: boolean
  ) {
    return withNativeProps(
      props,
      <FormItemLayout>
        <NoStyleItemContext.Provider value={onSubMetaChange}>
          {baseChildren}
        </NoStyleItemContext.Provider>
      </FormItemLayout>
    )
  }

  return (
    <Field {...fieldProps} name={name}>
      {(control, meta, context) => {
        const childNode: ReactNode = null
        // 必须标签：通过 props 的 required 与 rules 规则内的 required 取值
        const isRequired =
          required !== undefined
            ? required
            : rules && rules.some(rule => !!(rule && typeof rule === 'object' && rule.required))

        const nameList = toArray(name).length && meta ? meta.name : []
        const fieldId = (nameList.length > 0 && formName ? [formName, ...nameList] : nameList).join(
          '_'
        )

        return renderLayout(childNode, fieldId, meta, isRequired)
      }}
    </Field>
  )
}
