import './demo4.less'

import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Calendar } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  const today = dayjs()
  const [val, setVal] = useState<[Date, Date] | null>(() => [
    today.subtract(2, 'day').toDate(),
    today.add(2, 'day').toDate(),
  ])
  return (
    <>
      <DemoBlock title='自定义样式'>
        <Calendar
          className='calendar-custom'
          selectionMode='range'
          value={val}
          onChange={val => {
            setVal(val)
          }}
        />
      </DemoBlock>
    </>
  )
}
