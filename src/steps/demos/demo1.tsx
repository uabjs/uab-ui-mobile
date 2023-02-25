import React from 'react'
import { Steps } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

const { Step } = Steps

export default () => {
  return (
    <>
      <DemoBlock title='横向步骤条'>
        <Steps current={1}>
          <Step title='标题1' description='描述' />
          <Step title='标题2' description='描述' />
          <Step title='标题3' description='描述' />
        </Steps>
      </DemoBlock>

      <DemoBlock title='横向步骤条失败'>
        <Steps current={2}>
          <Step title='第一步' />
          <Step title='第二步' />
          <Step title='第三步' status='error' />
          <Step title='第四步' />
        </Steps>
      </DemoBlock>
    </>
  )
}
