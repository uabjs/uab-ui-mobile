import React, { FC, ReactNode } from 'react'
import { NativeProps, withNativeProps } from '../utils/native-props'

const classPrefix = `uabm-swiper-item`

type SwiperItemProps = {
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  children?: ReactNode
} & NativeProps

export const SwiperItem: FC<SwiperItemProps> = props => {
  return withNativeProps(
    props,
    <div className={classPrefix} onClick={props.onClick}>
      {props.children}
    </div>
  )
}
