import React, { FC, ReactNode, useContext, useRef } from 'react'
import { Field, FormInstance } from 'rc-field-form'
import type { FieldProps } from 'rc-field-form/es/Field'
import type { Meta, InternalNamePath } from 'rc-field-form/lib/interface'
import classNames from 'classnames'
import List, { ListItemProps } from '../list'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { toArray } from './utils'
import { FormContext, NoStyleItemContext } from './context'
import { useConfig } from '../config-provider'
import { FormLayout } from './index'

const classPrefix = `uabm-form-item`

type RenderChildren<Values = any> = (form: FormInstance<Values>) => React.ReactNode

type ChildrenType<Values = any> = RenderChildren<Values> | React.ReactNode

type RcFieldProps = Omit<FieldProps, 'children'>

export type FormItemProps = Pick<
  RcFieldProps,
  'dependencies' | 'name' | 'rules' | 'valuePropName'
> &
  Pick<ListItemProps, 'style' | 'extra' | 'description'> & {
    label?: ReactNode
    hasFeedback?: boolean
    required?: boolean
    children?: ChildrenType
    disabled?: boolean
    layout?: FormLayout
    onClick?: (e: React.MouseEvent, widgetRef: React.MutableRefObject<any>) => void
  } & NativeProps

interface MemoInputProps {
  value: any
  update: number
  children: ReactNode
}

// 判断前后 value update 不一致才重渲染组件，优化性能
const MemoInput = React.memo(
  ({ children }: MemoInputProps) => children as JSX.Element,
  (prev, next) => prev.value === next.value && prev.update === next.update
)

type FormItemLayoutProps = Pick<
  FormItemProps,
  | 'className'
  | 'style'
  | 'required'
  | 'layout'
  | 'description'
  | 'disabled'
  | 'label'
  | 'hasFeedback'
> & {
  onClick?: (e: React.MouseEvent) => void
  htmlFor?: string
  children: ReactNode
} & NativeProps

const FormItemLayout: FC<FormItemLayoutProps> = props => {
  const { className, style, required, label, htmlFor, children } = props

  const context = useContext(FormContext)
  const layout = props.layout || context.layout
  const disabled = props.disabled ?? context.disabled

  const { locale } = useConfig()

  const hasFeedback = props.hasFeedback !== undefined ? props.hasFeedback : context.hasFeeback

  const requiredMark = (() => {
    const { requiredMarkStyle } = context
    switch (requiredMarkStyle) {
      case 'asterisk':
        return (
          required && (
            <span className={`${classPrefix}-required-text`}>({locale.Form.required})</span>
          )
        )
      default:
        return null
    }
  })()

  const labelElement = label ? (
    <label className={`${classPrefix}-label`} htmlFor={htmlFor}>
      {label}
      {requiredMark}
    </label>
  ) : null

  const description =
    props.description || hasFeedback ? (
      <>
        {props.description}
        {/* {hasFeedback && (
          <>
            {props.errors.map((error, index) => {
              ;<div key={`error-${index}`} className={`${classPrefix}-feedback-error`}>
                {error}
              </div>
            })}
          </>
        )} */}
      </>
    ) : null

  return withNativeProps(
    props,
    <List.Item
      style={style}
      prefix={layout === 'horizontal' && labelElement}
      description={description}
      className={classNames(classPrefix, className, `${classPrefix}-${layout}`)}
      disabled={disabled}
      onClick={props.onClick}
    >
      <div className={classNames(`${classPrefix}-child`)}>
        <div className={classNames(`${classPrefix}-child-inner`)}>{children}</div>
      </div>
    </List.Item>
  )
}

export const FormItem: FC<FormItemProps> = props => {
  const {
    className,
    style,
    label,
    layout,
    description,
    name,
    required,
    rules,
    disabled,
    children,
    onClick,
    ...fieldProps
  } = props

  const { name: formName } = useContext(FormContext)

  const widgetRef = useRef<any>(null)

  const updateRef = useRef(0)
  updateRef.current += 1

  const onSubMetaChange = (subMeta: Meta & { destroy?: boolean }, namePath: InternalNamePath) => {
    console.log('subMeta====', subMeta)
    console.log('namePath====', namePath)
  }
  function renderLayout(
    baseChildren: ReactNode,
    fieldId?: string,
    meta?: Meta,
    isRequired?: boolean
  ) {
    return withNativeProps(
      props,
      <FormItemLayout
        className={className}
        style={style}
        label={label}
        layout={layout}
        htmlFor={fieldId}
        required={isRequired}
        description={description}
        disabled={disabled}
        onClick={onClick && (e => onClick(e, widgetRef))}
      >
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
