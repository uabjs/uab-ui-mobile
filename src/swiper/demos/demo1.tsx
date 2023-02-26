import './demo1.less'

import React, { useRef } from 'react'
import { Swiper, SwiperRef } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']

const items = colors.map((color, index) => (
  <Swiper.Item key={index}>
    <div
      className={'swiper-content'}
      style={{ background: color }}
      onClick={() => {
        // Toast.show(`你点击了卡片 ${index + 1}`)
      }}
    >
      {index + 1}
    </div>
  </Swiper.Item>
))

export default () => {
  const ref = useRef<SwiperRef>()

  return (
    <>
      <DemoBlock title='基础用法'>
        <Swiper>{items}</Swiper>
      </DemoBlock>
    </>
  )
}
