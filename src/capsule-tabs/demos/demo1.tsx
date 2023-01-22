import React from 'react'
import { CapsuleTabs } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <>
      <DemoBlock title='基础用法' padding='0'>
        <CapsuleTabs>
          <CapsuleTabs.Tab title='水果' key='fruits'>
            菠萝
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title='蔬菜' key='vegetables'>
            西红柿
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title='动物' key='animals'>
            蚂蚁
          </CapsuleTabs.Tab>
        </CapsuleTabs>
      </DemoBlock>
    </>
  )
}
