import React, {
  FC,
  ReactNode,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react'
import { Slide } from './slide'
import { Slides, SlidesRef } from './slides'
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

export type MultiImageViewerRef = SlidesRef

export type MultiImageViewerProps = Omit<ImageViewerProps, 'image' | 'renderFooter'> & {
  images?: string[]
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  renderFooter?: (image: string, index: number) => React.ReactNode
}

const multiDefaultProps = {
  ...defaultProps,
  defaultIndex: 0,
}

export const MultiImageViewer = forwardRef<MultiImageViewerRef, MultiImageViewerProps>((p, ref) => {
  const props = mergeProps(multiDefaultProps, p)
  const [index, setIndex] = useState(props.defaultIndex)

  const slidesRef = useRef<SlidesRef>(null)
  useImperativeHandle(ref, () => ({
    swipeTo: (index: number, immediate?: boolean) => {
      setIndex(index)
      slidesRef.current?.swipeTo(index, immediate)
    },
  }))

  const onSlideChange = useCallback(
    (index: number) => {
      setIndex(index)
      props.onIndexChange?.(index)
    },
    [props.onIndexChange]
  )

  const node = (
    <Mask
      visible={props.visible}
      disableBodyScroll={false}
      opacity='thick'
      afterClose={props.afterClose}
      destroyOnClose
    >
      <div className={`${classPrefix}-content`}>
        {props.images && (
          <Slides
            ref={slidesRef}
            defaultIndex={index}
            onIndexChange={onSlideChange}
            images={props.images}
            onTap={() => {
              props.onClose?.()
            }}
            maxZoom={props.maxZoom}
          />
        )}
      </div>
      {props.images && (
        <div className={`${classPrefix}-footer`}>
          {props.renderFooter?.(props.images[index], index)}
          <SafeArea position='bottom' />
        </div>
      )}
    </Mask>
  )

  return renderToContainer(props.getContainer, node)
})
