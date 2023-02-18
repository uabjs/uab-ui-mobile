import React, { FC, ReactNode, forwardRef } from 'react'
import { Slide } from './slide'
import Mask from '../mask'
import SafeArea from '../safe-area'
import { GetContainer, renderToContainer } from '../utils/render-to-container'
import { mergeProps } from '../utils/with-default-props'

const classPrefix = `uabm-image-viewer`

export type ImageViewerProps = {
  image?: string
  maxZoom?: number | 'auto'
  getContainer?: GetContainer
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

  const node = (
    <Mask
      visible={props.visible}
      disableBodyScroll={false}
      opacity='thick'
      afterClose={props.afterClose}
      destroyOnClose
    >
      {/* 图片栏，图片缩放 */}
      <div className={`${classPrefix}-content`}>
        {props.image && (
          <Slide
            image={props.image}
            onTap={() => {
              props.onClose?.()
            }}
            maxZoom={props.maxZoom}
          />
        )}
      </div>
      {/* 页脚 */}
      {props.image && (
        <div className={`${classPrefix}-footer`}>
          {props.renderFooter?.(props.image)}
          <SafeArea position='bottom' />
        </div>
      )}
    </Mask>
  )

  return renderToContainer(props.getContainer, node)
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

export const MultiImageViewerRef = ''

export const MultiImageViewer = forwardRef<MultiImageViewerRef, MultiImageViewerProps>((p, ref) => {
  return <div>多图片查看器</div>
})
