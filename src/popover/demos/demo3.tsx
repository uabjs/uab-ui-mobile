import React from 'react'
import { Button, Popover, Toast } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'
import { Action } from 'uab-ui-mobile/es/popover'
import {
  AntOutline,
  HandPayCircleOutline,
  ScanningOutline,
  TransportQRcodeOutline,
} from 'antd-mobile-icons'

const actions: Action[] = [
  { key: 'scan', icon: <ScanningOutline />, text: '扫一扫' },
  { key: 'payment', icon: <HandPayCircleOutline />, text: '付钱/收钱' },
  { key: 'bus', icon: <TransportQRcodeOutline />, text: '乘车码' },
  { key: 'assistant', icon: <AntOutline />, text: '智能助理', disabled: true },
]

export default () => {
  return (
    <>
      <DemoBlock title='浅色气泡菜单'>
        <Popover.Menu
          actions={actions}
          placement='bottom-start'
          onAction={node => Toast.show(`选择了 ${node.text}`)}
        >
          <Button>点我</Button>
        </Popover.Menu>
      </DemoBlock>

      <DemoBlock title='深色气泡菜单'>
        <Popover.Menu
          mode='dark'
          actions={actions}
          placement='right-start'
          onAction={node => Toast.show(`选择了 ${node.text}`)}
        >
          <Button>点我</Button>
        </Popover.Menu>
      </DemoBlock>

      <DemoBlock title='无图标气泡菜单'>
        <Popover.Menu
          actions={actions.map(action => ({
            ...action,
            icon: null,
          }))}
          onAction={node => Toast.show(`选择了 ${node.text}`)}
          placement='bottom-start'
        >
          <Button>点我</Button>
        </Popover.Menu>
      </DemoBlock>
    </>
  )
}
