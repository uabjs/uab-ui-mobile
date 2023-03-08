import './index.less'

import { Form } from './form'
import { FormItem } from './form-item'
import { attachPropertiesToComponent } from 'src/utils/attach-properties-to-component'

export default attachPropertiesToComponent(Form, {
  Item: FormItem,
})
