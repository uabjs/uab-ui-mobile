import './demo5.less'

import dayjs from 'dayjs'
import React from 'react'
import classNames from 'classnames'
import { Calendar } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <>
      <DemoBlock title='自定义日期渲染'>
        <Calendar
          renderDate={date => {
            const dates = [16, 17, 18, 19]
            const d = dayjs(date).date()
            return (
              <div
                className={classNames('custom-cell', {
                  ['custom-cell-selected']: dates.includes(d),
                })}
              >
                {d}
              </div>
            )
          }}
        />
      </DemoBlock>
    </>
  )
}
