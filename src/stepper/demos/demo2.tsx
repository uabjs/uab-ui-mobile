import React from 'react'
import { Stepper } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <>
      <DemoBlock title='禁用状态'>
        <Stepper disabled />
      </DemoBlock>

      <DemoBlock title='输入框只读状态'>
        <Stepper inputReadOnly />
      </DemoBlock>
    </>
  )
}
