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

      <DemoBlock title='自定义宽度'>
        <Stepper style={{ width: '120px' }} defaultValue={10000} step={10000} />
      </DemoBlock>

      <DemoBlock title='获得/失去焦点'>
        <Stepper
          onFocus={() => {
            // Toast.show('获得焦点')
            console.log('获得焦点')
          }}
          onBlur={() => {
            // Toast.show('失去焦点')
            console.log('失去焦点')
          }}
        />
      </DemoBlock>
    </>
  )
}
