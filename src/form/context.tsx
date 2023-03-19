import React from 'react'
import type { Meta, InternalNamePath } from 'rc-field-form/lib/interface'
import { FormLayout } from './index'

export type FormContextType = {
  name?: string
  hasFeeback: boolean
  layout: FormLayout
  requiredMarkStyle: 'asterisk' | 'text-required' | 'text-optional' | 'none'
  disabled: boolean
}

export const defaultFormContext: FormContextType = {
  name: undefined,
  hasFeeback: true,
  layout: 'vertical',
  requiredMarkStyle: 'asterisk',
  disabled: false,
}

export const FormContext = React.createContext<FormContextType>(defaultFormContext)

export type OnSubMetaChange = (
  meta: Meta & { destroy?: boolean },
  namePath: InternalNamePath
) => void
export const NoStyleItemContext = React.createContext<OnSubMetaChange | null>(null)
