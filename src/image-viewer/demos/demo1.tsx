import './demo1.less'

import React, { useState } from 'react'
import { Button, ImageViewer } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'
import { demoImage, demoImages } from './images'

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

// 多张图片预览
const Multi = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button
        onClick={() => {
          setVisible(true)
        }}
      >
        显示多张图片
      </Button>
      <ImageViewer.Multi
        images={demoImages}
        visible={visible}
        defaultIndex={1}
        onClose={() => {
          setVisible(false)
        }}
      />
    </>
  )
}

// 自定义底部额外内容
const ViewWithFooter = () => {
  const [visible, setVisible] = useState(false)

  const renderFooter = (image: string, index: number) => {
    return (
      <div className={'footer'}>
        <div
          className={'footerButton'}
          onClick={() => {
            console.log('Loading...')
          }}
        >
          下载图片{index + 1}
        </div>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={() => {
          setVisible(true)
        }}
      >
        显示图片
      </Button>
      <ImageViewer.Multi
        images={demoImages}
        visible={visible}
        defaultIndex={1}
        onClose={() => {
          setVisible(false)
        }}
        renderFooter={renderFooter}
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

      <DemoBlock title='多张图片预览'>
        <Multi />
      </DemoBlock>

      <DemoBlock title='指令式调用'>
        <Button
          onClick={() => {
            ImageViewer.Multi.show({ images: demoImages })
          }}
        >
          显示图片
        </Button>
      </DemoBlock>

      <DemoBlock title='自定义底部额外内容'>
        <ViewWithFooter />
      </DemoBlock>
    </>
  )
}
