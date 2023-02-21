import './collapse.less'

import { Collapse, CollapsePanel } from './collapse'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { CollapseProps, CollapsePanelProps } from './collapse'

export default attachPropertiesToComponent(Collapse, {
  Panel: CollapsePanel,
})
