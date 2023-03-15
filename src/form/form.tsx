import React, { forwardRef, ForwardedRef, ReactNode, useMemo } from 'react'
import RcForm from 'rc-field-form'
import classNames from 'classnames'
import merge from 'lodash/merge'
import type { FormProps as RcFormProps, FormInstance as RCFormInstance } from 'rc-field-form'
import { defaultFormContext, FormContextType, FormContext } from './context'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps } from '../utils/native-props'
import List, { ListProps } from '../list'
import { useConfig } from '../config-provider'
import { traverseReactNode } from '../utils/traverse-react-node'
import { Header } from './header'
import { FormArray } from './form-array'

const classPrefix = `uabm-form`

export type FormInstance = Pick<RCFormInstance, 'getFieldValue'>

export type FormProps = Pick<RcFormProps, 'form' | 'name' | 'validateMessages' | 'children'> &
  NativeProps<'--border-inner' | '--border-top' | '--border-bottom' | '--prefix-width'> &
  Partial<FormContextType> & {
    footer?: ReactNode
    mode?: ListProps['mode'] // 默认是整宽的列表，card 模式下展示为带 margin 和圆角的卡片
  }

const defaultProps = defaultFormContext

export const Form = forwardRef<FormInstance, FormProps>((p, ref) => {
  const props = mergeProps(defaultProps, p)
  const {
    className,
    style,
    mode,
    hasFeedback,
    layout,
    requiredMarkStyle,
    disabled,
    footer,
    ...formProps
  } = props

  const { locale } = useConfig()
  const validateMessages = useMemo(
    () => merge({}, locale.Form.defaultValidateMessages, formProps.validateMessages),
    [locale.Form.defaultValidateMessages, formProps.validateMessages]
  )

  const lists: ReactNode[] = []
  let currentHeader: ReactNode = null
  let items: ReactNode[] = []
  let count = 0
  function collect() {
    if (items.length === 0) return
    count += 1
    lists.push(
      <List header={currentHeader} key={count} mode={mode}>
        {items}
      </List>
    )
    items = []
  }
  // 遍历子节点
  traverseReactNode(props.children as ReactNode, child => {
    if (React.isValidElement(child)) {
      if (child.type === Header) {
        collect()
        currentHeader = child.props.children
        return
      } else if (child.type === FormArray) {
        collect()
        lists.push(child)
        return
      }
    }
    // type 其他类型走这里 如：Form.Item
    items.push(child)
  })
  collect()

  return (
    <RcForm
      className={classNames(classPrefix, className)}
      style={style}
      ref={ref as ForwardedRef<RCFormInstance>}
      {...formProps}
      validateMessages={validateMessages}
    >
      <FormContext.Provider
        value={{
          name: formProps.name,
          hasFeedback,
          layout,
          requiredMarkStyle,
          disabled,
        }}
      >
        {lists}
      </FormContext.Provider>
      {footer && <div className={`${classPrefix}-footer`}>{footer}</div>}
    </RcForm>
  )
})
