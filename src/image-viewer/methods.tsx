import React from 'react'
import { ImageViewer, ImageViewerProps } from './image-viewer'
import { renderImperatively, ImperativeHandler } from '../utils/render-imperatively'

const handlerSet = new Set<ImperativeHandler>()

export function clearImageViewer() {
  handlerSet.forEach(handler => {
    handler.close()
  })
}

export function showImageViewer(props: Omit<ImageViewerProps, 'visible'>) {
  clearImageViewer()

  const handler: ImperativeHandler = renderImperatively(
    <ImageViewer
      {...props}
      afterClose={() => {
        handlerSet.delete(handler)
        props.afterClose?.()
      }}
    />
  )
  handlerSet.add(handler)
  return handler
}
