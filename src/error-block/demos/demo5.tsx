import './demo5.less'

import React from 'react'
import { createErrorBlock, Space } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'
import { FileWrongOutline, SearchOutline } from 'antd-mobile-icons'

const ErrorBlock = createErrorBlock({
  default: <FileWrongOutline className={'myErrorBlockIcon'} />,
  empty: <SearchOutline className={'myErrorBlockIcon'} />,
})

export default () => {
  return (
    <>
      <DemoBlock title='四种状态'>
        <Space block direction='vertical' style={{ '--gap': '16px' }}>
          <ErrorBlock status='default' />
          <ErrorBlock status='empty' />
        </Space>
      </DemoBlock>
    </>
  )
}
