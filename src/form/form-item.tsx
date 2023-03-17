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

interface MemoInputProps {
  value: any
  update: number
  children: ReactNode
}
const MemoInput = React.memo(
  ({ children }: MemoInputProps) => children as JSX.Element,
  (prev, next) => prev.value === next.value && prev.update === next.update
)

export const FormItem: FC<FormItemProps> = props => {
  const { className, name, required, children, ...fieldProps } = props

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
        let childNode: ReactNode = null
        // 必须标签：通过 props 的 required 与 rules 规则内的 required 取值
        const isRequired =
          required !== undefined
            ? required
            : rules && rules.some(rule => !!(rule && typeof rule === 'object' && rule.required))

        const nameList = toArray(name).length && meta ? meta.name : []
        const fieldId = (nameList.length > 0 && formName ? [formName, ...nameList] : nameList).join(
          '_'
        )

        if (React.isValidElement(children)) {
          const childProps = { ...children.props }

          childNode = (
            <MemoInput value={control[props.valuePropName || 'value']} update={updateRef.current}>
              {React.cloneElement(children, childProps)}
            </MemoInput>
          )
        }

        return renderLayout(childNode, fieldId, meta, isRequired)
      }}
    </Field>
  )
}
