import React from 'react'
import { ConfigProvider, ErrorBlock } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'
import zhCN from '../../locales/zh-CN'
import zhTW from '../../locales/zh-TW'
import zhHK from '../../locales/zh-HK'
import enUS from '../../locales/en-US'
import faIR from '../../locales/fa-IR'

export default () => {
  return (
    <>
      <DemoBlock title='中文'>
        <ConfigProvider locale={zhCN}>
          <ErrorBlock status='disconnected' />
        </ConfigProvider>
      </DemoBlock>

      <DemoBlock title='英文'>
        <ConfigProvider locale={enUS}>
          <ErrorBlock status='disconnected' />
        </ConfigProvider>
      </DemoBlock>

      <DemoBlock title='中文(台湾繁体)'>
        <ConfigProvider locale={zhTW}>
          <ErrorBlock status='disconnected' />
        </ConfigProvider>
      </DemoBlock>

      <DemoBlock title='中文(香港繁体)'>
        <ConfigProvider locale={zhHK}>
          <ErrorBlock status='disconnected' />
        </ConfigProvider>
      </DemoBlock>

      <DemoBlock title='波斯语'>
        <ConfigProvider locale={faIR}>
          <ErrorBlock />
        </ConfigProvider>
      </DemoBlock>
    </>
  )
}
