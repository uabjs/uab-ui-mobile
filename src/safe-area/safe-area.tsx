import React from 'react'
import classNames from 'classnames'
import { NativeProps, withNativeProps } from '../utils/native-props'

const classPrafix = `uabm-safe-area`

export type SafeAreaProps = {
  position: 'top' | 'bottom'
} & NativeProps

export const SafeArea: React.FC<SafeAreaProps> = props => {
  return withNativeProps(props, <div className={classNames(classPrafix, `${classPrafix}-position`)} />)
}
