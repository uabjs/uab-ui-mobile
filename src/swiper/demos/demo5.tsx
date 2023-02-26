import './demo5.less'

import React from 'react'
import { Swiper } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']

const verticalItems = colors.map((color, index) => (
  <Swiper.Item key={index}>
    <div className={'vertical-content'} style={{ background: color }}>
      {index + 1}
    </div>
  </Swiper.Item>
))

export default () => {
  return (
    <>
      <DemoBlock title='竖向'>
        <Swiper direction='vertical' style={{ '--height': '200px' }}>
          {verticalItems}
        </Swiper>
      </DemoBlock>
    </>
  )
}
