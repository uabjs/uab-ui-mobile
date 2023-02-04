import './jumbo-tabs.less'
import { JumboTab, JumboTabs } from './jumbo-tabs'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { JumboTabProps, JumboTabsProps } from './jumbo-tabs'

export default attachPropertiesToComponent(JumboTabs, {
  Tab: JumboTab,
})
