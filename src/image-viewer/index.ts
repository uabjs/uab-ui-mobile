import './image-viewer.less'

import { ImageViewer, MultiImageViewer } from './image-viewer'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { ImageViewerProps, MultiImageViewerProps, MultiImageViewerRef } from './image-viewer'

const Multi = attachPropertiesToComponent(MultiImageViewer, {
  show: () => {},
})

export default attachPropertiesToComponent(ImageViewer, {
  Multi,
  // show: show
})
