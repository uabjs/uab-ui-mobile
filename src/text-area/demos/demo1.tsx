import React, { useState } from 'react'
import { TextArea } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  const [value, setValue] = useState('')

  return (
    <>
      <DemoBlock title='基本的输入框组件'>
        <TextArea
          placeholder='请输入内容'
          value={value}
          onChange={val => {
            setValue(val)
          }}
        />
      </DemoBlock>

      <DemoBlock title='指定行数'>
        <TextArea placeholder='请输入内容' rows={5} />
      </DemoBlock>

      <DemoBlock title='根据内容自动调整高度'>
        <TextArea placeholder='请输入内容' autoSize={{ minRows: 3, maxRows: 5 }} />
      </DemoBlock>

      <DemoBlock title='字数统计'>
        <TextArea defaultValue={'枫叶红艳秋瑟瑟，\n山静月明海蒼蒼。'} showCount />
      </DemoBlock>

      <DemoBlock title='字数限制'>
        <TextArea defaultValue={'云霞绕峰风拂面，\n潺潺流水韵悠扬。'} showCount maxLength={30} />
      </DemoBlock>

      <DemoBlock title='禁用状态'>
        <TextArea placeholder='请输入内容' value={'落日余晖映林荫，\n画船轻摇渔村旁。'} disabled />
      </DemoBlock>

      <DemoBlock title='只读状态'>
        <TextArea placeholder='请输入内容' value={'清风徐来悠然心，\n万物皆随自然长。'} readOnly />
      </DemoBlock>
    </>
  )
}
