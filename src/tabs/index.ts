import './tabs.less'

import { Tabs, Tab } from './tabs'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { TabsProps, TabProps } from './tabs'

export default attachPropertiesToComponent(Tabs, {
  Tab,
})
