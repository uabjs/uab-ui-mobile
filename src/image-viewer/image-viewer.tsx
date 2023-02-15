import React, { FC, ReactNode, forwardRef } from 'react'
import { mergeProps } from '../utils/with-default-props'

const classPrefix = `uabm-image-viewer`

export type ImageViewerProps = {
  image?: string
  maxZoom?: number | 'auto'
  // getContainer?: GetContainer
  visible?: boolean
  onClose?: () => void
  afterClose?: () => void
  renderFooter?: (image: string) => ReactNode
}

const defaultProps = {
  maxZoom: 3,
  getContainer: null,
  visible: false,
}

export const ImageViewer: FC<ImageViewerProps> = p => {
  const props = mergeProps(defaultProps, p)

  return <div>图片查看器</div>
}

export type MultiImageViewerProps = Omit<ImageViewerProps, 'image' | 'renderFooter'> & {
  images?: string[]
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  renderFooter?: (image: string, index: number) => React.ReactNode
}

const MultiDefaultProps = {
  ...defaultProps,
  defaultIndex: 0,
}

const MultiImageViewerRef = ''

export const MultiImageViewer = forwardRef<MultiImageViewerRef, MultiImageViewerProps>((p, ref) => {
  return <div>多图片查看器</div>
})
