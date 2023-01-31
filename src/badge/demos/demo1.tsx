import './demo1.less'

import React from 'react'
import { Space, Badge } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <>
      <DemoBlock title='基础用法'>
        <Space style={{ '--gap': '24px' }}>
          <Badge content='5'>
            <div className={'box'}></div>
          </Badge>
          <Badge content='新'>
            <div className={'box'} />
          </Badge>
          <Badge content={Badge.dot}>
            <div className={'box'} />
          </Badge>
        </Space>
      </DemoBlock>

      <DemoBlock title='带边框'>
        <Badge content='更新啦' bordered>
          <div className={'box dark'} />
        </Badge>
      </DemoBlock>

      <DemoBlock title='独立使用'>
        <Space>
          <Badge content='99+' />
          <Badge content='新消息!' />
        </Space>
      </DemoBlock>

      <DemoBlock title='自定义颜色和偏移量'>
        <Space style={{ '--gap': '24px' }}>
          <Badge color='#108ee9' content={Badge.dot} style={{ '--right': '100%', '--top': '100%' }}>
            <div className={'box'} />
          </Badge>
          <Badge color='#87d068' content={Badge.dot} style={{ '--right': '100%' }}>
            <div className={'box'} />
          </Badge>
          <Badge content={Badge.dot}>
            <div className={'box'} />
          </Badge>
          <Badge color='orange' content={Badge.dot} style={{ '--top': '100%' }}>
            <div className={'box'} />
          </Badge>
        </Space>
      </DemoBlock>
    </>
  )
}
