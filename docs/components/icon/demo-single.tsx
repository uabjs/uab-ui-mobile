import React from 'react'
import { ClockCircleFill, ClockCircleOutline } from 'antd-mobile-icons'
import { Space } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <>
      <DemoBlock title='基础用法'>
        <Space wrap style={{ fontSize: 36 }}>
          <ClockCircleFill />
          <ClockCircleOutline />
        </Space>
      </DemoBlock>

      <DemoBlock title='大小'>
        <Space wrap align='center'>
          <ClockCircleFill fontSize={12} />
          <ClockCircleOutline fontSize={24} />
          <ClockCircleFill fontSize={36} />
          <ClockCircleOutline fontSize={48} />
        </Space>
      </DemoBlock>

      <DemoBlock title='颜色'>
        <Space wrap style={{ fontSize: 36 }}>
          <ClockCircleFill color='#76c6b8' />
          <ClockCircleOutline color='var(--uabm-color-primary)' />
          <ClockCircleFill color='var(--uabm-color-weak)' />
          <ClockCircleOutline color='var(--uabm-color-danger)' />
        </Space>
      </DemoBlock>
    </>
  )
}
