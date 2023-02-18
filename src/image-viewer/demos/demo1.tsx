import React, { useState } from 'react'
import { Button, ImageViewer } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'
import { demoImage } from './images'

// 单张图片预览
const Single = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setVisible(true)
        }}
      >
        显示图片
      </Button>
      <ImageViewer
        image={demoImage}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      />
    </>
  )
}

export default () => {
  return (
    <>
      <DemoBlock title='单张图片预览'>
        <Single />
      </DemoBlock>
    </>
  )
}
