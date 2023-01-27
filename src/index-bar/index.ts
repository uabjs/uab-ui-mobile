import './index-bar.less'
import { Panel } from './panel'
import { IndexBar } from './index-bar'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { IndexBarProps, IndexBarRef } from './index-bar'
export type { IndexBarPanelProps } from './panel'

export default attachPropertiesToComponent(IndexBar, {
  Panel,
})
