import './image-viewer.less'

import { ImageViewer, MultiImageViewer } from './image-viewer'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'
import { clearImageViewer, showImageViewer } from './methods'

export type { ImageViewerProps, MultiImageViewerProps, MultiImageViewerRef } from './image-viewer'

const Multi = attachPropertiesToComponent(MultiImageViewer, {
  show: () => {},
})

export default attachPropertiesToComponent(ImageViewer, {
  Multi,
  show: showImageViewer,
  clear: clearImageViewer,
})
