import './demo1.less'

import React, { FC, useState } from 'react'
import { Button, Mask, Space } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

// 基础用法
const Simple: FC = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>显示背景蒙层</Button>
      <Mask visible={visible} onMaskClick={() => setVisible(false)} />
    </>
  )
}

export default () => {
  return (
    <>
      <DemoBlock title='基础用法'>
        <Simple />
      </DemoBlock>
    </>
  )
}
