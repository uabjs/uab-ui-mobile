import React from 'react'
import { Stepper } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <>
      <DemoBlock title='基础用法'>
        <Stepper
          defaultValue={1}
          onChange={value => {
            console.log(value)
          }}
        />
      </DemoBlock>
    </>
  )
}
