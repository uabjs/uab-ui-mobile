import React from 'react'
import { DotLoading } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <>
      <DemoBlock title='默认'>
        <DotLoading />
      </DemoBlock>

      <DemoBlock title='主题色 Loading'>
        <DotLoading color='primary' />
      </DemoBlock>

      <DemoBlock title='白色 Loading' background='#a5a5a5'>
        <DotLoading color='white' />
      </DemoBlock>
    </>
  )
}
