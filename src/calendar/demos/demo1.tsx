import React from 'react'
import { Calendar } from 'uab-ui-mobile'
import { DemoBlock, DemoDescription } from 'uab-ui-mobile-demos'

const defaultSingle = new Date('2022-03-09')

export default () => {
  return (
    <>
      <DemoBlock title='仅展示'>
        <Calendar />
      </DemoBlock>
    </>
  )
}
