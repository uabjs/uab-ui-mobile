import './demo1.less'

import React, { useState } from 'react'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { Input } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)

  return (
    <>
      <DemoBlock title='基础用法'>
        <Input
          placeholder='请输入内容'
          value={value}
          onChange={val => {
            setValue(val)
          }}
        />
      </DemoBlock>

      <DemoBlock title='带清除按钮'>
        <Input placeholder='请输入内容' clearable />
      </DemoBlock>

      <DemoBlock title='输入内容右对齐'>
        <Input placeholder='请输入验证码' style={{ '--text-align': 'right' }} clearable />
      </DemoBlock>

      <DemoBlock title='只读状态'>
        <Input placeholder='请输入内容' value='只读模式的输入框' readOnly />
      </DemoBlock>

      <DemoBlock title='禁用状态'>
        <Input placeholder='请输入内容' value='被禁用的输入框' disabled />
      </DemoBlock>

      <DemoBlock title='查看密码'>
        <div className={'input-password'}>
          <Input
            className={'input'}
            placeholder='请输入密码'
            type={visible ? 'text' : 'password'}
          />
          <div className={'eye'}>
            {!visible ? (
              <EyeInvisibleOutline onClick={() => setVisible(true)} />
            ) : (
              <EyeOutline onClick={() => setVisible(false)} />
            )}
          </div>
        </div>
      </DemoBlock>
    </>
  )
}
