import './image-viewer.less'

import { ImageViewer, MultiImageViewer } from './image-viewer'
import { attachPropertiesToComponent } from 'src/utils/attach-properties-to-component'

const Multi = attachPropertiesToComponent(MultiImageViewer, {
  show: () => {},
})

export default attachPropertiesToComponent(ImageViewer, {
  Multi,
  // show: show
})
