import React, { FC, MutableRefObject } from 'react'

type SlideProps = {
  image: string
  maxZoom: number | 'auto'
  onTap: () => void
  onZoomChange?: (zoom: number) => void
  dragLockRef?: MutableRefObject<boolean>
}

export const Slide: FC<SlideProps> = props => {
  return <div></div>
}
