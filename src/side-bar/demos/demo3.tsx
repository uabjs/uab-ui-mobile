import './demo3.less'

import React, { useState } from 'react'
import classNames from 'classnames'
import { SideBar } from 'uab-ui-mobile'
import { tabs } from './tabs'

export default () => {
  const [activeKey, setActiveKey] = useState('key1')

  return (
    <div className={'container'}>
      <div className={'side'}>
        <SideBar activeKey={activeKey} onChange={setActiveKey}>
          {tabs.map(item => (
            <SideBar.Item key={item.key} title={item.title} />
          ))}
        </SideBar>
      </div>
      <div className={'main'}>
        <div className={classNames('content', { active: activeKey === 'key1' })}>页面 1</div>
        <div className={classNames('content', { active: activeKey === 'key2' })}>页面 2</div>
        <div className={classNames('content', { active: activeKey === 'key3' })}>页面 3</div>
      </div>
    </div>
  )
}
