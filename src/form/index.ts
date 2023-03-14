import './index.less'

import { Form } from './form'
import { FormItem } from './form-item'
import { attachPropertiesToComponent } from 'src/utils/attach-properties-to-component'
import { FormArray } from './form-array'

export type FormLayout = 'vertical' | 'horizontal'

export default attachPropertiesToComponent(Form, {
  Item: FormItem,
  Array: FormArray,
})
