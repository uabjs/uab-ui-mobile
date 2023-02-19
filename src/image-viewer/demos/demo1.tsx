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
      <DemoBlock title='手动控制关闭'>
        <Button
          onClick={() => {
            const handler = ImageViewer.show({
              image: demoImage,
            })
            setTimeout(() => {
              handler.close()
            }, 3000)
          }}
        >
          显示图片并在3秒后关闭
        </Button>
      </DemoBlock>
    </>
  )
}
