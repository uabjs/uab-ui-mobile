import React from 'react'
import { Calendar } from 'uab-ui-mobile'
import { DemoBlock, DemoDescription } from 'uab-ui-mobile-demos'

const defaultSingle = new Date('2023-04-08')

export default () => {
  return (
    <>
      <DemoBlock title='仅展示'>
        <Calendar />
        <DemoDescription>
          如果你不设置 selectionMode 属性，那么日历默认是不支持进行选择操作的
        </DemoDescription>
      </DemoBlock>

      <DemoBlock title='自定义导航'>
        <Calendar
          prevMonthButton={<span>上一月</span>}
          nextMonthButton={<span>下一月</span>}
          prevYearButton={<span>上一年</span>}
          nextYearButton={<span>下一年</span>}
        />
      </DemoBlock>

      <DemoBlock title='选择某一天'>
        <Calendar
          selectionMode='single'
          defaultValue={defaultSingle}
          onChange={val => {
            console.log(val)
          }}
        />
      </DemoBlock>
    </>
  )
}
