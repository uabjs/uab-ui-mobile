import './capsule-tabs.less'

import { CapsuleTab, CapsuleTabs } from 'capsule-tabs'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export { CapsuleTabsProps, CapsuleTabProps } from 'capsule-tabs'

export default attachPropertiesToComponent(CapsuleTabs, {
  Tab: CapsuleTab,
})
