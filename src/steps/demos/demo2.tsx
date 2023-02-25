import React from 'react'
import { CheckCircleFill, ClockCircleFill, HandPayCircleOutline } from 'antd-mobile-icons'
import { Steps, Button, Space } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

const { Step } = Steps

export default () => {
  return (
    <>
      <DemoBlock title='自定义图标及大小'>
        <Steps
          direction='vertical'
          current={1}
          style={{
            '--title-font-size': '17px',
            '--description-font-size': '15px',
            '--indicator-margin-right': '12px',
            '--icon-size': '22px',
          }}
        >
          <Step title='填写机构信息' description='这里是一些描述' icon={<CheckCircleFill />} />
          <Step
            title='签约机构'
            description={
              <Space block direction='vertical'>
                <div>这里是一些描述</div>
                <Button color='primary'>去查看</Button>
              </Space>
            }
            icon={<ClockCircleFill />}
          />
          <Step title='关联服务区' description='这里是一些描述' icon={<HandPayCircleOutline />} />
        </Steps>
      </DemoBlock>
    </>
  )
}
