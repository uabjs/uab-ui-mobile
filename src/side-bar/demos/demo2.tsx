import React from 'react'
import { SideBar } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'
import { tabs } from './tabs'

export default () => {
  return (
    <>
      <DemoBlock title='选择带数字' padding='0'>
        <SideBar>
          <SideBar.Item
            key='key1'
            title={
              <div>
                选择项一
                <span className={'count'}>(8)</span>
              </div>
            }
          />
          <SideBar.Item
            key='key2'
            title={
              <div>
                选项二有点长它折行了
                <span className={'count'}>(5)</span>
              </div>
            }
          />
        </SideBar>
      </DemoBlock>
    </>
  )
}
