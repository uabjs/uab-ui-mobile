import './index.less'

import { Form } from './form'
import { FormItem } from './form-item'
import { attachPropertiesToComponent } from 'src/utils/attach-properties-to-component'
import { FormArray } from './form-array'
import { Header } from './header'

export type FormLayout = 'vertical' | 'horizontal'
export type { FormProps, FormInstance } from './form'
export type { FormItemProps } from './form-item'

export default attachPropertiesToComponent(Form, {
  Item: FormItem,
  Array: FormArray,
  Header,
})
